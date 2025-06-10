const { client, INDEX_NAME } = require('../config/elasticsearch');
const { sql, getPool } = require('../config/db');

class ElasticsearchService {
  
  // Đồng bộ tất cả tours từ SQL Server vào Elasticsearch
  async syncAllTours(options = {}) {
    try {
      const {
        mode = 'full', // 'full' | 'incremental' | 'force'
        batchSize = 100,
        retryAttempts = 3,
        cleanIndex = false // Xóa hết rồi sync lại từ đầu
      } = options;

      console.log(`🔄 Starting ${mode} tour synchronization...`);
      
      // Clean index nếu được yêu cầu
      if (cleanIndex) {
        console.log('🧹 Cleaning Elasticsearch index...');
        try {
          await client.deleteByQuery({
            index: INDEX_NAME,
            body: {
              query: { match_all: {} }
            }
          });
          console.log('✅ Index cleaned successfully');
        } catch (error) {
          console.warn('⚠️ Error cleaning index:', error.message);
        }
      }
      
      const pool = await getPool();
      
      // Build query based on mode
      let whereClause = "WHERE t.status IN ('active', 'upcoming')";
      
      if (mode === 'incremental') {
        // Chỉ sync tours được tạo trong 24h qua (vì không có updated_at column)
        whereClause += " AND t.created_at >= DATEADD(day, -1, GETDATE())";
      } else if (mode === 'force') {
        // Sync tất cả tours không phụ thuộc status
        whereClause = "WHERE 1=1";
      }

      const query = `
        SELECT 
          t.tour_id,
          t.branch_id,
          t.name,
          t.destination,
          t.departure_location,
          t.start_date,
          t.end_date,
          t.max_guests,
          t.transport,
          t.duration,
          t.status,
          t.description,
          t.created_at,
          tp_adult.price as adult_price,
          tp_child.price as child_price,
          tp_infant.price as infant_price,
          (SELECT TOP 1 image_url 
           FROM Tour_image ti 
           WHERE ti.tour_id = t.tour_id 
           ORDER BY image_id ASC) AS cover_image,
          ISNULL((
            SELECT SUM(bd.quantity)
            FROM Booking b
            INNER JOIN Booking_Detail bd ON b.booking_id = bd.booking_id
            WHERE b.tour_id = t.tour_id AND b.status = 'confirmed'
          ), 0) AS booked_slots
        FROM Tour t
        LEFT JOIN Tour_Price tp_adult ON t.tour_id = tp_adult.tour_id AND tp_adult.age_group = 'adultPrice'
        LEFT JOIN Tour_Price tp_child ON t.tour_id = tp_child.tour_id AND tp_child.age_group = 'childPrice'
        LEFT JOIN Tour_Price tp_infant ON t.tour_id = tp_infant.tour_id AND tp_infant.age_group = 'infantPrice'
        ${whereClause}
        ORDER BY t.created_at DESC
      `;

      const result = await pool.request().query(query);
      const tours = result.recordset;

      if (tours.length === 0) {
        console.log('📝 No tours found to sync');
        return { success: true, synced: 0, skipped: 0, errors: 0 };
      }

      console.log(`📊 Found ${tours.length} tours to sync`);

      // Process in batches để tránh timeout
      let totalSynced = 0;
      let totalErrors = 0;
      let errorDetails = [];

      for (let i = 0; i < tours.length; i += batchSize) {
        const batch = tours.slice(i, i + batchSize);
        console.log(`🔄 Processing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(tours.length/batchSize)} (${batch.length} tours)...`);

        const { synced, errors, errorDetails: batchErrors } = await this.syncTourBatch(batch, retryAttempts);
        
        totalSynced += synced;
        totalErrors += errors;
        errorDetails.push(...batchErrors);

        // Small delay between batches để không overwhelm Elasticsearch
        if (i + batchSize < tours.length) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      // Refresh index để có thể search ngay
      await client.indices.refresh({ index: INDEX_NAME });

      // Verify final count
      const countResult = await client.count({ index: INDEX_NAME });
      const actualCount = countResult.body?.count || countResult.count || 0;

      console.log(`✅ Synchronization completed:`);
      console.log(`   📈 Total processed: ${tours.length}`);
      console.log(`   ✅ Successfully synced: ${totalSynced}`);
      console.log(`   ❌ Errors: ${totalErrors}`);
      console.log(`   🔍 Total documents in index: ${actualCount}`);
      
      if (errorDetails.length > 0) {
        console.log(`⚠️  Error details:`, errorDetails.slice(0, 5)); // Show first 5 errors
      }

      return { 
        success: totalErrors === 0, 
        synced: totalSynced, 
        errors: totalErrors,
        totalInIndex: actualCount,
        errorDetails: errorDetails
      };

    } catch (error) {
      console.error('❌ Error syncing tours:', error.message);
      throw error;
    }
  }

  // Helper method để sync một batch tours
  async syncTourBatch(tours, retryAttempts = 3) {
    let attempt = 0;
    let lastError;

    while (attempt < retryAttempts) {
      try {
        // Prepare bulk operations
        const body = [];
        tours.forEach(tour => {
          const categories = this.generateCategories(tour);
          const price_range = this.getPriceRange(tour.adult_price);
          
          // Create all_text field for comprehensive search
          const all_text = [
            tour.name,
            tour.destination,
            tour.departure_location,
            tour.description,
            ...categories,
            price_range,
            tour.transport
          ].filter(Boolean).join(' ');

          // Index operation
          body.push({
            index: {
              _index: INDEX_NAME,
              _id: tour.tour_id
            }
          });

          // Document data
          body.push({
            tour_id: tour.tour_id,
            name: tour.name || '',
            destination: tour.destination || '',
            departure_location: tour.departure_location || '',
            description: tour.description || '',
            price_range: price_range,
            adult_price: parseFloat(tour.adult_price) || 0,
            child_price: parseFloat(tour.child_price) || 0,
            infant_price: parseFloat(tour.infant_price) || 0,
            duration: parseInt(tour.duration) || 1,
            start_date: tour.start_date,
            end_date: tour.end_date,
            max_guests: parseInt(tour.max_guests) || 0,
            booked_slots: parseInt(tour.booked_slots) || 0,
            transport: tour.transport || '',
            status: tour.status || 'active',
            branch_id: parseInt(tour.branch_id) || 0,
            created_at: tour.created_at,
            cover_image: tour.cover_image || '',
            categories: categories,
            all_text: all_text,
            popularity_score: this.calculatePopularityScore(tour),
            quality_score: this.calculateQualityScore(tour)
          });
        });

        if (body.length === 0) {
          return { synced: 0, errors: 0, errorDetails: [] };
        }

        const bulkResponse = await client.bulk({ body: body });
        
        // Handle response
        const items = bulkResponse.body?.items || bulkResponse.items || [];
        let successCount = 0;
        let errorCount = 0;
        let errorDetails = [];

        items.forEach((item, index) => {
          if (item.index) {
            if (item.index.error) {
              errorCount++;
              const tourId = tours[Math.floor(index)]?.tour_id || 'unknown';
              errorDetails.push({
                tourId: tourId,
                error: item.index.error.reason || item.index.error,
                status: item.index.status
              });
              console.error(`❌ Error indexing tour ${tourId}:`, item.index.error.reason);
            } else {
              successCount++;
            }
          }
        });

        console.log(`   ✅ Batch: ${successCount} synced, ${errorCount} errors`);
        
        return { synced: successCount, errors: errorCount, errorDetails };

      } catch (error) {
        attempt++;
        lastError = error;
        console.warn(`⚠️ Batch sync attempt ${attempt} failed:`, error.message);
        
        if (attempt < retryAttempts) {
          console.log(`🔄 Retrying in ${attempt * 2} seconds...`);
          await new Promise(resolve => setTimeout(resolve, attempt * 2000));
        }
      }
    }

    // All retries failed
    console.error(`❌ Batch sync failed after ${retryAttempts} attempts:`, lastError.message);
    return { 
      synced: 0, 
      errors: tours.length, 
      errorDetails: [{
        tourId: 'batch_error',
        error: lastError.message,
        toursAffected: tours.map(t => t.tour_id)
      }]
    };
  }

  // Đồng bộ một tour cụ thể
  async syncSingleTour(tourId) {
    try {
      const pool = await getPool();
      const query = `
        SELECT 
          t.tour_id, t.branch_id, t.name, t.destination, t.departure_location,
          t.start_date, t.end_date, t.max_guests, t.transport, t.duration,
          t.status, t.description, t.created_at,
          tp_adult.price as adult_price,
          tp_child.price as child_price,
          tp_infant.price as infant_price,
          (SELECT TOP 1 image_url FROM Tour_image ti WHERE ti.tour_id = t.tour_id ORDER BY image_id ASC) AS cover_image,
          ISNULL((SELECT SUM(bd.quantity) FROM Booking b INNER JOIN Booking_Detail bd ON b.booking_id = bd.booking_id WHERE b.tour_id = t.tour_id AND b.status = 'confirmed'), 0) AS booked_slots
        FROM Tour t
        LEFT JOIN Tour_Price tp_adult ON t.tour_id = tp_adult.tour_id AND tp_adult.age_group = 'adultPrice'
        LEFT JOIN Tour_Price tp_child ON t.tour_id = tp_child.tour_id AND tp_child.age_group = 'childPrice'
        LEFT JOIN Tour_Price tp_infant ON t.tour_id = tp_infant.tour_id AND tp_infant.age_group = 'infantPrice'
        WHERE t.tour_id = @tourId
      `;

      const result = await pool.request()
        .input('tourId', sql.NVarChar, tourId)
        .query(query);

      if (result.recordset.length === 0) {
        console.log(`📝 Tour ${tourId} not found`);
        return { success: false };
      }

      const tour = result.recordset[0];
      const categories = this.generateCategories(tour);

      await client.index({
        index: INDEX_NAME,
        id: tour.tour_id,
        body: {
          tour_id: tour.tour_id,
          name: tour.name,
          destination: tour.destination,
          departure_location: tour.departure_location,
          description: tour.description || '',
          adult_price: tour.adult_price || 0,
          child_price: tour.child_price || 0,
          infant_price: tour.infant_price || 0,
          duration: tour.duration,
          start_date: tour.start_date,
          end_date: tour.end_date,
          max_guests: tour.max_guests,
          booked_slots: tour.booked_slots,
          transport: tour.transport,
          status: tour.status,
          branch_id: tour.branch_id,
          created_at: tour.created_at,
          cover_image: tour.cover_image || 'uploads/default.jpg',
          categories: categories,
          price_range: this.getPriceRange(tour.adult_price)
        }
      });

      console.log(`✅ Successfully synced tour ${tourId}`);
      return { success: true };

    } catch (error) {
      console.error(`❌ Error syncing tour ${tourId}:`, error.message);
      throw error;
    }
  }

  // Tìm kiếm tours với Elasticsearch
  async searchTours(searchParams) {
    try {
      const {
        query = '',
        destination = '',
        departure = '',
        budget = '',
        date = '',
        transport = '',
        duration = '',
        page = 1,
        size = 10
      } = searchParams;

      const must = [];
      const should = [];
      const filter = [];

      // Điều kiện bắt buộc: chỉ lấy tour active
      filter.push({ terms: { status: ['active', 'upcoming'] } });

      // Advanced Full-text search cho query chính
      if (query && query.trim()) {
        const searchQuery = query.trim();
        
        // Multi-stage search strategy
        should.push(
          // 1. Exact phrase match (highest priority)
          {
            multi_match: {
              query: searchQuery,
              fields: [
                'name^5',
                'destination^4', 
                'description^4',
                'all_text^3',
                'categories.text^3'
              ],
              type: 'phrase',
              boost: 4.0
            }
          },
          // 2. Phrase prefix match (for partial matches)
          {
            multi_match: {
              query: searchQuery,
              fields: [
                'name^4',
                'destination^3',
                'description^3',
                'all_text^2.5',
                'departure_location^2'
              ],
              type: 'phrase_prefix',
              boost: 3.0
            }
          },
          // 3. Best fields match (for relevance)
          {
            multi_match: {
              query: searchQuery,
              fields: [
                'name^4',
                'destination^3',
                'description^3',
                'all_text^2.5',
                'categories.text^2.5',
                'departure_location^2'
              ],
              type: 'best_fields',
              fuzziness: 'AUTO',
              operator: 'or',
              boost: 2.5
            }
          },
          // 4. Cross fields match (for better matching)
          {
            multi_match: {
              query: searchQuery,
              fields: [
                'name^3',
                'destination^2.5',
                'description^2.5',
                'all_text^2',
                'categories.text^2'
              ],
              type: 'cross_fields',
              operator: 'and',
              boost: 2.0
            }
          },
          // 5. All text comprehensive search
          {
            match: {
              all_text: {
                query: searchQuery,
                fuzziness: 'AUTO',
                boost: 1.8
              }
            }
          },
          // 6. Description specific search
          {
            match: {
              description: {
                query: searchQuery,
                fuzziness: 'AUTO',
                boost: 1.5
              }
            }
          },
          // 7. Fuzzy match (for typos)
          {
            multi_match: {
              query: searchQuery,
              fields: [
                'name^2',
                'destination^1.5',
                'description^1.5',
                'all_text^1'
              ],
              fuzziness: 2,
              prefix_length: 1,
              boost: 1.0
            }
          }
        );

        // Add to must if we have should clauses
        must.push({
          bool: {
            should: should,
            minimum_should_match: 1
          }
        });
      }

      // Filter theo destination
      if (destination && destination.trim()) {
        filter.push({
          bool: {
            should: [
              {
                match: {
                  destination: {
                    query: destination.trim(),
                    fuzziness: 'AUTO',
                    boost: 2.0
                  }
                }
              },
              {
                match_phrase: {
                  destination: {
                    query: destination.trim(),
                    boost: 3.0
                  }
                }
              }
            ]
          }
        });
      }

      // Filter theo departure_location
      if (departure && departure.trim()) {
        filter.push({
          bool: {
            should: [
              {
                match: {
                  departure_location: {
                    query: departure.trim(),
                    fuzziness: 'AUTO',
                    boost: 2.0
                  }
                }
              },
              {
                match_phrase: {
                  departure_location: {
                    query: departure.trim(),
                    boost: 3.0
                  }
                }
              }
            ]
          }
        });
      }

      // Filter theo budget (price range)
      if (budget && budget.trim()) {
        const priceRange = this.getBudgetRange(budget);
        if (priceRange) {
          filter.push({
            range: {
              adult_price: priceRange
            }
          });
        }
      }

      // Filter theo transport
      if (transport && transport.trim()) {
        filter.push({
          term: { transport: transport }
        });
      }

      // Filter theo duration
      if (duration && duration.trim()) {
        const durationRange = this.getDurationRange(duration);
        if (durationRange) {
          filter.push({
            range: {
              duration: durationRange
            }
          });
        }
      }

      // Filter theo date
      if (date && date.trim()) {
        filter.push({
          range: {
            start_date: {
              gte: date,
              format: 'yyyy-MM-dd'
            }
          }
        });
      }

      // Build main query with function score
      const searchBody = {
        query: {
          function_score: {
            query: {
              bool: {
                must: must.length > 0 ? must : [{ match_all: {} }],
                filter: filter
              }
            },
            functions: [
              // Boost popular tours
              {
                filter: { range: { booked_slots: { gte: 10 } } },
                weight: 1.2
              },
              // Boost newer tours
              {
                filter: { range: { created_at: { gte: 'now-30d' } } },
                weight: 1.1
              },
              // Boost tours with higher capacity - safer script
              {
                script_score: {
                  script: {
                    source: "Math.max(1.0, Math.log(2 + (doc['max_guests'].size() > 0 ? doc['max_guests'].value : 1)) / Math.log(2 + 20))"
                  }
                }
              },
              // Boost tours with reasonable price - safer script
              {
                script_score: {
                  script: {
                    source: "doc['adult_price'].size() > 0 && doc['adult_price'].value > 0 ? Math.max(0.5, 1.0 / Math.log(1 + doc['adult_price'].value / 1000000)) : 1.0"
                  }
                }
              }
            ],
            score_mode: 'multiply',
            boost_mode: 'multiply'
          }
        },
        sort: [
          { _score: { order: 'desc' } },  // Sắp xếp theo điểm relevance
          { created_at: { order: 'desc' } } // Sau đó theo thời gian tạo
        ],
        from: (page - 1) * size,
        size: size,
        highlight: {
          fields: {
            name: {
              fragment_size: 150,
              number_of_fragments: 1,
              pre_tags: ['<mark>'],
              post_tags: ['</mark>']
            },
            destination: {
              fragment_size: 100,
              number_of_fragments: 1,
              pre_tags: ['<mark>'],
              post_tags: ['</mark>']
            },
            description: {
              fragment_size: 200,
              number_of_fragments: 2,
              pre_tags: ['<mark>'],
              post_tags: ['</mark>']
            }
          },
          require_field_match: false
        }
      };

      const response = await client.search({
        index: INDEX_NAME,
        body: searchBody
      });

      // Handle both old and new response structure
      const hits = response.body?.hits?.hits || response.hits?.hits || [];
      const total = response.body?.hits?.total?.value || response.hits?.total?.value || 0;

      return {
        tours: hits.map(hit => ({
          ...hit._source,
          _score: hit._score,
          highlights: hit.highlight,
          explanation: hit._explanation || null
        })),
        total: total,
        page: page,
        totalPages: Math.ceil(total / size),
        maxScore: response.body?.hits?.max_score || response.hits?.max_score || 0
      };

    } catch (error) {
      console.error('❌ Search error:', error.message);
      throw error;
    }
  }

  // Gợi ý tìm kiếm (autocomplete) - using advanced search strategies
  async getSuggestions(query) {
    try {
      if (!query || query.length < 1) {
        return [];
      }

      const searchQuery = query.toLowerCase().trim();
      
      // Multi-strategy suggestions
      const response = await client.search({
        index: INDEX_NAME,
        body: {
          query: {
            bool: {
              should: [
                // 1. Phrase prefix match cho name (highest priority)
                {
                  match_phrase_prefix: {
                    name: {
                      query: searchQuery,
                      boost: 5.0,
                      max_expansions: 10
                    }
                  }
                },
                // 2. Phrase prefix match cho destination
                {
                  match_phrase_prefix: {
                    destination: {
                      query: searchQuery,
                      boost: 4.0,
                      max_expansions: 10
                    }
                  }
                },
                // 3. Edge ngram match cho partial matching
                {
                  match: {
                    'name.ngram': {
                      query: searchQuery,
                      boost: 3.0
                    }
                  }
                },
                // 4. Fuzzy match cho typos
                {
                  match: {
                    name: {
                      query: searchQuery,
                      fuzziness: 'AUTO',
                      prefix_length: 1,
                      boost: 2.0
                    }
                  }
                },
                // 5. Destination fuzzy match
                {
                  match: {
                    destination: {
                      query: searchQuery,
                      fuzziness: 'AUTO',
                      prefix_length: 1,
                      boost: 1.8
                    }
                  }
                },
                // 6. Category suggestions
                {
                  match: {
                    'categories.text': {
                      query: searchQuery,
                      boost: 1.5
                    }
                  }
                }
              ],
              filter: [
                { terms: { status: ['active', 'upcoming'] } }
              ],
              minimum_should_match: 1
            }
          },
          size: 15,
          _source: ['name', 'destination', 'departure_location', 'categories', 'adult_price'],
          sort: [
            { _score: { order: 'desc' } },
            { booked_slots: { order: 'desc' } }
          ],
          highlight: {
            fields: {
              name: {
                pre_tags: [''],
                post_tags: [''],
                fragment_size: 100
              },
              destination: {
                pre_tags: [''],
                post_tags: [''],
                fragment_size: 50
              }
            }
          }
        }
      });

      const hits = response.body?.hits?.hits || response.hits?.hits || [];
      const suggestions = new Set();
      const detailedSuggestions = [];
      
      hits.forEach((hit, index) => {
        const source = hit._source;
        const score = hit._score;
        
        // Add tour name suggestions
        if (source.name && source.name.toLowerCase().includes(searchQuery)) {
          const suggestion = {
            text: source.name,
            type: 'tour',
            score: score,
            price: source.adult_price,
            destination: source.destination,
            highlight: hit.highlight?.name?.[0] || source.name,
            priority: 1
          };
          
          if (!suggestions.has(source.name)) {
            suggestions.add(source.name);
            detailedSuggestions.push(suggestion);
          }
        }
        
        // Add destination suggestions
        if (source.destination && source.destination.toLowerCase().includes(searchQuery)) {
          const destinationText = `Đến ${source.destination}`;
          const suggestion = {
            text: destinationText,
            type: 'destination',
            score: score * 0.9,
            originalText: source.destination,
            highlight: hit.highlight?.destination?.[0] || source.destination,
            priority: 2
          };
          
          if (!suggestions.has(destinationText)) {
            suggestions.add(destinationText);
            detailedSuggestions.push(suggestion);
          }
        }
        
        // Add departure suggestions
        if (source.departure_location && source.departure_location.toLowerCase().includes(searchQuery)) {
          const departureText = `Từ ${source.departure_location}`;
          const suggestion = {
            text: departureText,
            type: 'departure',
            score: score * 0.8,
            originalText: source.departure_location,
            priority: 3
          };
          
          if (!suggestions.has(departureText)) {
            suggestions.add(departureText);
            detailedSuggestions.push(suggestion);
          }
        }
        
        // Add category suggestions
        if (source.categories && Array.isArray(source.categories)) {
          source.categories.forEach(category => {
            if (category.toLowerCase().includes(searchQuery)) {
              const categoryText = this.getCategoryDisplayName(category);
              const suggestion = {
                text: categoryText,
                type: 'category',
                score: score * 0.7,
                originalText: category,
                priority: 4
              };
              
              if (!suggestions.has(categoryText)) {
                suggestions.add(categoryText);
                detailedSuggestions.push(suggestion);
              }
            }
          });
        }
      });

      // Sort by priority and score, limit results
      return detailedSuggestions
        .sort((a, b) => {
          if (a.priority !== b.priority) {
            return a.priority - b.priority;
          }
          return b.score - a.score;
        })
        .slice(0, 8)
        .map(suggestion => ({
          text: suggestion.text,
          type: suggestion.type,
          score: Math.round(suggestion.score * 100) / 100,
          highlight: suggestion.highlight || suggestion.text,
          ...(suggestion.price && { price: suggestion.price }),
          ...(suggestion.destination && { destination: suggestion.destination }),
          ...(suggestion.originalText && { originalText: suggestion.originalText })
        }));

    } catch (error) {
      console.error('❌ Suggestion error:', error.message);
      return [];
    }
  }

  // Helper function để chuyển đổi category thành display name
  getCategoryDisplayName(category) {
    const categoryMap = {
      'beach': 'Tour biển',
      'mountain': 'Tour núi',
      'temple': 'Tour tâm linh',
      'hanoi': 'Tour Hà Nội',
      'hochiminh': 'Tour Hồ Chí Minh',
      'budget': 'Tour tiết kiệm',
      'luxury': 'Tour cao cấp',
      'bus': 'Tour xe khách',
      'flight': 'Tour máy bay',
      'short': 'Tour ngắn ngày',
      'long': 'Tour dài ngày'
    };
    
    return categoryMap[category] || category;
  }

  // Helper methods
  generateCategories(tour) {
    const categories = [];
    
    // Categorize by destination
    if (tour.destination) {
      if (tour.destination.includes('biển') || tour.destination.includes('beach')) {
        categories.push('beach');
      }
      if (tour.destination.includes('núi') || tour.destination.includes('mountain')) {
        categories.push('mountain');
      }
      if (tour.destination.includes('Hà Nội')) {
        categories.push('hanoi');
      }
      if (tour.destination.includes('Hồ Chí Minh') || tour.destination.includes('Sài Gòn')) {
        categories.push('hochiminh');
      }
    }

    // Categorize by transport
    if (tour.transport) {
      categories.push(tour.transport.toLowerCase());
    }

    // Categorize by price
    if (tour.adult_price) {
      if (tour.adult_price < 5000000) categories.push('budget');
      else if (tour.adult_price > 20000000) categories.push('luxury');
      else categories.push('mid-range');
    }

    return categories;
  }

  getPriceRange(price) {
    if (!price) return 'unknown';
    if (price < 5000000) return 'under-5m';
    if (price < 10000000) return '5m-10m';
    if (price < 20000000) return '10m-20m';
    return 'over-20m';
  }

  getBudgetRange(budget) {
    const ranges = {
      'under-5m': { lt: 5000000 },
      '5m-10m': { gte: 5000000, lt: 10000000 },
      '10m-20m': { gte: 10000000, lt: 20000000 },
      'over-20m': { gte: 20000000 }
    };
    return ranges[budget];
  }

  getDurationRange(duration) {
    const ranges = {
      'short': { lte: 3 },      // 1-3 ngày
      'medium': { gte: 4, lte: 7 }, // 4-7 ngày
      'long': { gte: 8 }        // 8+ ngày
    };
    return ranges[duration];
  }

  // Calculate popularity score based on bookings and other factors
  calculatePopularityScore(tour) {
    const bookedSlots = parseInt(tour.booked_slots) || 0;
    const maxGuests = parseInt(tour.max_guests) || 1;
    const bookingRatio = bookedSlots / maxGuests;
    
    // Base score from booking ratio
    let score = Math.min(bookingRatio * 2, 2.0);
    
    // Boost for newer tours (within 30 days)
    const createdAt = new Date(tour.created_at);
    const daysSinceCreated = (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceCreated <= 30) {
      score += 0.3;
    }
    
    // Boost for tours with good capacity
    if (maxGuests >= 20) {
      score += 0.2;
    }
    
    return Math.max(0.5, Math.min(3.0, score));
  }

  // Calculate quality score based on various factors
  calculateQualityScore(tour) {
    let score = 1.0;
    
    // Score based on description length and quality
    const descLength = (tour.description || '').length;
    if (descLength > 200) score += 0.3;
    if (descLength > 500) score += 0.2;
    
    // Score based on price reasonableness
    const price = parseFloat(tour.adult_price) || 0;
    const duration = parseInt(tour.duration) || 1;
    const pricePerDay = price / duration;
    
    if (pricePerDay >= 1000000 && pricePerDay <= 5000000) {
      score += 0.2; // Reasonable price range
    }
    
    // Score based on transport type
    if (tour.transport === 'flight') score += 0.3;
    else if (tour.transport === 'bus') score += 0.1;
    
    // Score based on image availability
    if (tour.cover_image && tour.cover_image !== '') {
      score += 0.2;
    }
    
    return Math.max(0.5, Math.min(2.5, score));
  }

  // Xóa tour khỏi Elasticsearch
  async deleteTour(tourId) {
    try {
      await client.delete({
        index: INDEX_NAME,
        id: tourId
      });
      console.log(`✅ Deleted tour ${tourId} from Elasticsearch`);
      return { success: true };
    } catch (error) {
      if (error.statusCode === 404) {
        console.log(`📝 Tour ${tourId} not found in Elasticsearch`);
        return { success: true };
      }
      console.error(`❌ Error deleting tour ${tourId}:`, error.message);
      throw error;
    }
  }
}

module.exports = new ElasticsearchService(); 