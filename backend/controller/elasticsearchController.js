const elasticsearchService = require('../services/elasticsearchService');
const { testConnection, createTourIndex } = require('../config/elasticsearch');

// Initialize Elasticsearch
const initializeElasticsearch = async (req, res) => {
  try {
    // Test connection
    const isConnected = await testConnection();
    if (!isConnected) {
      return res.status(500).json({ 
        error: 'Không thể kết nối đến Elasticsearch' 
      });
    }

    // Create index
    await createTourIndex();

    // Sync all tours
    const syncResult = await elasticsearchService.syncAllTours();

    res.status(200).json({
      message: 'Khởi tạo Elasticsearch thành công',
      connected: true,
      indexCreated: true,
      synced: syncResult.synced
    });

  } catch (error) {
    console.error('❌ Initialize Elasticsearch error:', error.message);
    res.status(500).json({ 
      error: 'Lỗi khởi tạo Elasticsearch: ' + error.message 
    });
  }
};

// Đồng bộ dữ liệu tours
const syncTours = async (req, res) => {
  try {
    console.log('🔄 Starting sync tours...');
    
    // Parse options from query params
    const {
      mode = 'full',          // 'full' | 'incremental' | 'force'
      batchSize = 100,        // số tours per batch
      retryAttempts = 3,      // số lần retry
      cleanIndex = 'false'    // xóa hết trước khi sync
    } = req.query;

    const options = {
      mode,
      batchSize: parseInt(batchSize) || 100,
      retryAttempts: parseInt(retryAttempts) || 3,
      cleanIndex: cleanIndex === 'true'
    };

    console.log('🔧 Sync options:', options);
    
    const result = await elasticsearchService.syncAllTours(options);
    
    res.status(200).json({
      message: 'Tours synchronized successfully',
      options: options,
      ...result
    });

  } catch (error) {
    console.error('❌ Sync tours error:', error.message);
    res.status(500).json({ 
      error: 'Lỗi đồng bộ tours: ' + error.message 
    });
  }
};

// Tìm kiếm tours với Elasticsearch
const searchTours = async (req, res) => {
  try {
    const searchParams = {
      query: req.query.q || req.query.search || '',
      destination: req.query.destination || '',
      departure: req.query.departure || '',
      budget: req.query.budget || '',
      date: req.query.date || '',
      transport: req.query.transport || '',
      duration: req.query.duration || '',
      page: parseInt(req.query.page) || 1,
      size: parseInt(req.query.size) || 10
    };

    console.log('🔍 Elasticsearch search params:', searchParams);

    const result = await elasticsearchService.searchTours(searchParams);
    console.log('🎯 Elasticsearch raw result:', JSON.stringify({
      toursCount: result.tours.length,
      total: result.total,
      page: result.page,
      firstTour: result.tours[0] ? result.tours[0].name : 'No tours'
    }, null, 2));

    // Transform data để tương thích với frontend hiện tại
    const transformedTours = result.tours.map(tour => ({
      tour_id: tour.tour_id,
      name: tour.name,
      destination: tour.destination,
      departureLocation: tour.departure_location,
      start_date: tour.start_date,
      end_date: tour.end_date,
      max_guests: tour.max_guests,
      booked_slots: tour.booked_slots,
      duration: tour.duration,
      price: tour.adult_price, // Sử dụng adult_price làm price chính
      cover_image: tour.cover_image,
      transport: tour.transport,
      status: tour.status,
      description: tour.description,
      _score: tour._score, // Điểm relevance từ Elasticsearch
      highlights: tour.highlights // Highlighted text
    }));

    const responseData = {
      tours: transformedTours,
      pagination: {
        total: result.total,
        page: result.page,
        totalPages: result.totalPages,
        size: searchParams.size
      },
      searchInfo: {
        query: searchParams.query,
        hasQuery: !!searchParams.query.trim(),
        source: 'elasticsearch'
      }
    };

    console.log('📤 Final response:', JSON.stringify({
      toursCount: responseData.tours.length,
      total: responseData.pagination.total,
      query: responseData.searchInfo.query
    }, null, 2));

    res.status(200).json(responseData);

  } catch (error) {
    console.error('❌ Search tours error:', error.message);
    res.status(500).json({ 
      error: 'Lỗi tìm kiếm tours: ' + error.message 
    });
  }
};

// So sánh kết quả tìm kiếm giữa SQL và Elasticsearch
const compareSearch = async (req, res) => {
  try {
    const searchQuery = req.query.q || req.query.search || '';
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 10;

    if (!searchQuery.trim()) {
      return res.status(400).json({ 
        error: 'Vui lòng nhập từ khóa tìm kiếm' 
      });
    }

    // Tìm kiếm với Elasticsearch
    const elasticResult = await elasticsearchService.searchTours({
      query: searchQuery,
      page,
      size
    });

    // Tìm kiếm với SQL (sử dụng logic cũ)
    const { sql, getPool } = require('../config/db');
    const pool = await getPool();
    
    const sqlQuery = `
      SELECT t.tour_id, t.name, t.destination, t.departure_location, 
             t.start_date, t.max_guests, t.duration, tp.price,
             (SELECT TOP 1 image_url FROM Tour_image ti WHERE ti.tour_id = t.tour_id ORDER BY image_id ASC) AS cover_image,
             ISNULL((SELECT SUM(bd.quantity) FROM Booking b INNER JOIN Booking_Detail bd ON b.booking_id = bd.booking_id WHERE b.tour_id = t.tour_id AND b.status = 'confirmed'), 0) AS booked_slots
      FROM Tour t
      LEFT JOIN Tour_Price tp ON t.tour_id = tp.tour_id AND tp.age_group = 'adultPrice'
      WHERE t.status IN ('active', 'upcoming') 
        AND (t.name LIKE @searchText OR t.destination LIKE @searchText OR t.description LIKE @searchText)
      ORDER BY t.created_at DESC
      OFFSET @offset ROWS FETCH NEXT @size ROWS ONLY
    `;

    const sqlResult = await pool.request()
      .input('searchText', sql.NVarChar, `%${searchQuery}%`)
      .input('offset', sql.Int, (page - 1) * size)
      .input('size', sql.Int, size)
      .query(sqlQuery);

    // Transform SQL result
    const sqlTours = sqlResult.recordset.map(tour => ({
      tour_id: tour.tour_id,
      name: tour.name,
      destination: tour.destination,
      departureLocation: tour.departure_location,
      start_date: tour.start_date,
      max_guests: tour.max_guests,
      duration: tour.duration,
      price: tour.price,
      cover_image: tour.cover_image || 'uploads/default.jpg',
      booked_slots: tour.booked_slots
    }));

    // Transform Elasticsearch result
    const elasticTours = elasticResult.tours.map(tour => ({
      tour_id: tour.tour_id,
      name: tour.name,
      destination: tour.destination,
      departureLocation: tour.departure_location,
      start_date: tour.start_date,
      max_guests: tour.max_guests,
      duration: tour.duration,
      price: tour.adult_price,
      cover_image: tour.cover_image,
      booked_slots: tour.booked_slots,
      _score: tour._score,
      highlights: tour.highlights
    }));

    res.status(200).json({
      query: searchQuery,
      comparison: {
        sql: {
          tours: sqlTours,
          count: sqlTours.length,
          method: 'SQL LIKE'
        },
        elasticsearch: {
          tours: elasticTours,
          count: elasticTours.length,
          total: elasticResult.total,
          method: 'Elasticsearch with Vietnamese analyzer',
          averageScore: elasticTours.length > 0 ? 
            (elasticTours.reduce((sum, tour) => sum + (tour._score || 0), 0) / elasticTours.length).toFixed(2) : 0
        }
      },
      analysis: {
        sqlFoundCount: sqlTours.length,
        elasticsearchFoundCount: elasticTours.length,
        difference: Math.abs(sqlTours.length - elasticTours.length),
        elasticsearchAdvantages: [
          'Hỗ trợ tìm kiếm mờ (fuzzy search)',
          'Xử lý tiếng Việt tốt hơn với custom analyzer',
          'Điểm relevance scoring',
          'Highlight kết quả tìm kiếm',
          'Tìm kiếm đồng nghĩa (synonym)',
          'Tìm kiếm multi-field với trọng số'
        ]
      }
    });

  } catch (error) {
    console.error('❌ Compare search error:', error.message);
    res.status(500).json({ 
      error: 'Lỗi so sánh tìm kiếm: ' + error.message 
    });
  }
};

// Lấy gợi ý tìm kiếm (autocomplete)
const getSuggestions = async (req, res) => {
  try {
    const query = req.query.q || '';
    
    if (!query.trim()) {
      return res.status(200).json({ suggestions: [] });
    }

    const suggestions = await elasticsearchService.getSuggestions(query);
    
    res.status(200).json({ 
      suggestions: suggestions.slice(0, 5) // Chỉ trả về 5 gợi ý đầu tiên
    });

  } catch (error) {
    console.error('❌ Get suggestions error:', error.message);
    res.status(500).json({ 
      error: 'Lỗi lấy gợi ý: ' + error.message 
    });
  }
};

// Thống kê Elasticsearch
const getElasticsearchStats = async (req, res) => {
  try {
    const { client, INDEX_NAME } = require('../config/elasticsearch');
    
    // Kiểm tra trạng thái index
    const indexExists = await client.indices.exists({ index: INDEX_NAME });
    
    if (!indexExists) {
      return res.status(200).json({
        indexExists: false,
        message: 'Elasticsearch index chưa được tạo'
      });
    }

    // Lấy thống kê index
    const indexStats = await client.indices.stats({ index: INDEX_NAME });
    const indexInfo = await client.indices.get({ index: INDEX_NAME });
    
    // Đếm số documents
    const countResponse = await client.count({ index: INDEX_NAME });
    
    // Lấy một số tours mẫu
    const sampleResponse = await client.search({
      index: INDEX_NAME,
      body: {
        size: 5,
        sort: [{ created_at: { order: 'desc' } }]
      }
    });

    // Handle both old and new response structure
    const totalDocs = countResponse.body?.count || countResponse.count || 0;
    const indexStatsData = indexStats.body?.indices?.[INDEX_NAME] || indexStats.indices?.[INDEX_NAME] || {};
    const indexInfoData = indexInfo.body?.[INDEX_NAME] || indexInfo[INDEX_NAME] || {};
    const sampleHits = sampleResponse.body?.hits?.hits || sampleResponse.hits?.hits || [];

    res.status(200).json({
      indexExists: true,
      stats: {
        totalDocuments: totalDocs,
        indexSize: indexStatsData.total?.store?.size_in_bytes || 0,
        indexSizeFormatted: `${((indexStatsData.total?.store?.size_in_bytes || 0) / 1024 / 1024).toFixed(2)} MB`,
        shards: indexInfoData.settings?.index?.number_of_shards || '1',
        replicas: indexInfoData.settings?.index?.number_of_replicas || '1'
      },
      sampleTours: sampleHits.map(hit => ({
        tour_id: hit._source?.tour_id,
        name: hit._source?.name,
        destination: hit._source?.destination,
        categories: hit._source?.categories
      })),
      analyzer: {
        name: 'vietnamese_analyzer',
        features: [
          'Loại bỏ dấu tiếng Việt (asciifolding)',
          'Stop words tiếng Việt',
          'Synonym mapping',
          'Lowercase normalization'
        ]
      }
    });

  } catch (error) {
    console.error('❌ Get stats error:', error.message);
    res.status(500).json({ 
      error: 'Lỗi lấy thống kê: ' + error.message 
    });
  }
};

// Test tính năng Vietnamese analyzer
const testVietnameseAnalyzer = async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ 
        error: 'Vui lòng nhập text để test' 
      });
    }

    const { client, INDEX_NAME } = require('../config/elasticsearch');
    
    // Test Vietnamese analyzer
    const analyzeResponse = await client.indices.analyze({
      index: INDEX_NAME,
      body: {
        analyzer: 'vietnamese_analyzer',
        text: text
      }
    });

    // Test standard analyzer để so sánh
    const standardResponse = await client.indices.analyze({
      body: {
        analyzer: 'standard',
        text: text
      }
    });

    // Handle both old and new response structure
    const vietnameseTokens = analyzeResponse.body?.tokens || analyzeResponse.tokens || [];
    const standardTokens = standardResponse.body?.tokens || standardResponse.tokens || [];

    res.status(200).json({
      originalText: text,
      vietnamese_analyzer: {
        tokens: vietnameseTokens.map(token => token.token)
      },
      standard_analyzer: {
        tokens: standardTokens.map(token => token.token)
      },
      comparison: {
        vietnamese_count: vietnameseTokens.length,
        standard_count: standardTokens.length,
        advantages: [
          'Vietnamese analyzer loại bỏ dấu tiếng Việt',
          'Xử lý stop words tiếng Việt',
          'Hỗ trợ synonym mapping'
        ]
      }
    });

  } catch (error) {
    console.error('❌ Test analyzer error:', error.message);
    res.status(500).json({ 
      error: 'Lỗi test analyzer: ' + error.message 
    });
  }
};

// Reset và tái tạo Elasticsearch index với config mới
const resetElasticsearch = async (req, res) => {
  try {
    const { client, INDEX_NAME, createTourIndex } = require('../config/elasticsearch');
    
    console.log('🔄 Bắt đầu reset Elasticsearch index...');
    
    // 1. Xóa index cũ nếu tồn tại
    const indexExists = await client.indices.exists({ index: INDEX_NAME });
    if (indexExists) {
      await client.indices.delete({ index: INDEX_NAME });
      console.log('🗑️ Đã xóa index cũ');
    }
    
    // 2. Tạo index mới với config mới
    await createTourIndex();
    console.log('🆕 Đã tạo index mới với config cập nhật');
    
    // 3. Sync lại toàn bộ dữ liệu
    const syncResult = await elasticsearchService.syncAllTours();
    console.log('✅ Đã sync lại dữ liệu');
    
    res.status(200).json({
      message: 'Reset Elasticsearch thành công',
      indexRecreated: true,
      synced: syncResult.synced,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Reset Elasticsearch error:', error.message);
    res.status(500).json({ 
      error: 'Lỗi reset Elasticsearch: ' + error.message 
    });
  }
};

// Debug indexing (test với 1 tour cụ thể)
const debugIndexing = async (req, res) => {
  try {
    const { client, INDEX_NAME } = require('../config/elasticsearch');
    
    console.log('🔍 Starting debug indexing...');
    
    // Test với data mẫu
    const testDoc = {
      tour_id: 'TEST001',
      name: 'Test Tour Hà Nội',
      destination: 'Hà Nội',
      departure_location: 'TP.HCM',
      description: 'Tour test',
      adult_price: 1000000,
      status: 'active',
      created_at: new Date()
    };

    console.log('🔍 Test document:', testDoc);

    // Thử index trực tiếp
    const indexResult = await client.index({
      index: INDEX_NAME,
      id: 'TEST001',
      body: testDoc
    });

    console.log('🔍 Index result:', indexResult);

    // Refresh index để có thể search ngay
    await client.indices.refresh({ index: INDEX_NAME });

    // Kiểm tra document đã được index chưa
    const getResult = await client.get({
      index: INDEX_NAME,
      id: 'TEST001'
    });

    console.log('🔍 Get result:', getResult);

    // Đếm lại documents
    const countResult = await client.count({ index: INDEX_NAME });
    console.log('🔍 Total documents:', countResult);

    res.status(200).json({
      message: 'Debug indexing thành công',
      indexResult: indexResult,
      getResult: getResult,
      totalDocs: countResult.body?.count || countResult.count || 0
    });

  } catch (error) {
    console.error('❌ Debug indexing error:', error.message);
    res.status(500).json({ 
      error: 'Lỗi debug indexing: ' + error.message 
    });
  }
};

module.exports = {
  initializeElasticsearch,
  syncTours,
  searchTours,
  compareSearch,
  getSuggestions,
  getElasticsearchStats,
  testVietnameseAnalyzer,
  resetElasticsearch,
  debugIndexing
}; 