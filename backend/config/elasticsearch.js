const { Client } = require('@elastic/elasticsearch');
require('dotenv').config();

// Khởi tạo Elasticsearch client
const client = new Client({
  cloud: {
    id: process.env.ELASTICSEARCH_CLOUD_ID || '77289e5b39fa40a8b04dabccf72306c1:dXMtY2VudHJhbDEuZ2NwLmNsb3VkLmVzLmlvJDc4M2EwZmQyZTUxYTQ0ZDJiODU0OWI1MGViMDNhMGQ3JDUxOWM4MmFmNWM1OTQ5YWU5ZjQxMmRjZjNmYzdjMDA0'// Từ Elastic Cloud console
  },
  auth: {
    username: process.env.ELASTICSEARCH_USERNAME || 'elastic',
    password: process.env.ELASTICSEARCH_PASSWORD || '0fq8jpexhBk7in49ifCw1Jxs'
  },
  requestTimeout: 60000,
  maxRetries: 3
});

// Test connection
const testConnection = async () => {
  try {
    // Kiểm tra config trước
    if (!process.env.ELASTICSEARCH_CLOUD_ID) {
      console.error('❌ ELASTICSEARCH_CLOUD_ID không được cấu hình trong .env');
      return false;
    }
    if (!process.env.ELASTICSEARCH_PASSWORD) {
      console.error('❌ ELASTICSEARCH_PASSWORD không được cấu hình trong .env');
      return false;
    }

    console.log('🔧 Đang kết nối đến Elasticsearch...');
    console.log('📡 Cloud ID:', process.env.ELASTICSEARCH_CLOUD_ID.substring(0, 20) + '...');
    console.log('👤 Username:', process.env.ELASTICSEARCH_USERNAME);
    
    const response = await client.ping();
    console.log('✅ Elasticsearch connected successfully');
    return true;
  } catch (error) {
    console.error('❌ Elasticsearch connection failed:');
    console.error('   Error type:', error.name);
    console.error('   Error message:', error.message);
    console.error('   Status code:', error.statusCode || 'N/A');
    
    if (error.message.includes('ENOTFOUND')) {
      console.error('💡 Gợi ý: Kiểm tra ELASTICSEARCH_CLOUD_ID có đúng không');
    } else if (error.message.includes('401') || error.message.includes('Unauthorized')) {
      console.error('💡 Gợi ý: Kiểm tra ELASTICSEARCH_USERNAME và ELASTICSEARCH_PASSWORD');
    } else if (error.message.includes('ECONNREFUSED')) {
      console.error('💡 Gợi ý: Kiểm tra kết nối mạng hoặc Elasticsearch service có đang chạy');
    }
    
    return false;
  }
};

// Tạo index với Vietnamese analyzer
const createTourIndex = async () => {
  const indexName = 'tour_index';
  
  try {
    // Kiểm tra xem index đã tồn tại chưa
    const exists = await client.indices.exists({ index: indexName });
    
    if (!exists) {
      await client.indices.create({
        index: indexName,
        body: {
          settings: {
            analysis: {
              tokenizer: {
                vietnamese_tokenizer: {
                  type: 'edge_ngram',
                  min_gram: 2,
                  max_gram: 20,
                  token_chars: ['letter', 'digit']
                }
              },
              analyzer: {
                vietnamese_analyzer: {
                  type: 'custom',
                  tokenizer: 'standard',
                  filter: [
                    'lowercase',
                    'asciifolding',
                    'vietnamese_stop_filter',
                    'vietnamese_synonym_filter'
                  ]
                },
                vietnamese_search_analyzer: {
                  type: 'custom',
                  tokenizer: 'standard',
                  filter: [
                    'lowercase',
                    'asciifolding',
                    'vietnamese_stop_filter',
                    'vietnamese_synonym_filter'
                  ]
                },
                vietnamese_autocomplete: {
                  type: 'custom',
                  tokenizer: 'vietnamese_tokenizer',
                  filter: [
                    'lowercase',
                    'asciifolding'
                  ]
                }
              },
              filter: {
                vietnamese_stop_filter: {
                  type: 'stop',
                  stopwords: [
                    'là', 'và', 'của', 'có', 'được', 'trong', 'với', 'để', 'tại', 'từ',
                    'cho', 'về', 'sau', 'trước', 'khi', 'nếu', 'nhưng', 'hoặc', 'mà',
                    'đã', 'sẽ', 'đang', 'rất', 'nhiều', 'ít', 'lớn', 'nhỏ', 'cao', 'thấp',
                    'này', 'ấy', 'kia', 'đó', 'đây', 'nào', 'gì', 'ai', 'nào', 'đâu'
                  ]
                },
                vietnamese_synonym_filter: {
                  type: 'synonym',
                  synonyms: [
                    'hanoi,thudu',
                    'saigon,tphcm,hochiminh',
                    'danang',
                    'dalat',
                    'beach,bien',
                    'mountain,nui',
                    'temple,chua',
                    'cheap,re',
                    'expensive,dat',
                    'bus,buyt',
                    'flight,maybay',
                    'det,lua,thucong,kyso,truyen,thong,handicraft,weaving,silk,traditional,craft',
                    'det,weaving,textile',
                    'lua,silk',
                    'thucong,handicraft,craft',
                    'kyso,technique,skill',
                    'truyen,thong,traditional,classical',
                    'lang,village',
                    'nghe,thuât,art,artistic'
                  ]
                }
              }
            },
            number_of_shards: 1,
            number_of_replicas: 1
          },
          mappings: {
            properties: {
              tour_id: { type: 'keyword' },
              name: { 
                type: 'text',
                analyzer: 'vietnamese_analyzer',
                search_analyzer: 'vietnamese_search_analyzer',
                fields: {
                  keyword: { type: 'keyword' },
                  suggest: { 
                    type: 'text',
                    analyzer: 'vietnamese_autocomplete',
                    search_analyzer: 'vietnamese_search_analyzer'
                  },
                  raw: { type: 'keyword' },
                  ngram: { 
                    type: 'text',
                    analyzer: 'vietnamese_autocomplete'
                  }
                }
              },
              destination: { 
                type: 'text',
                analyzer: 'vietnamese_analyzer',
                search_analyzer: 'vietnamese_search_analyzer',
                fields: { 
                  keyword: { type: 'keyword' },
                  suggest: { 
                    type: 'text',
                    analyzer: 'vietnamese_autocomplete',
                    search_analyzer: 'vietnamese_search_analyzer'
                  }
                }
              },
              departure_location: { 
                type: 'text',
                analyzer: 'vietnamese_analyzer',
                search_analyzer: 'vietnamese_search_analyzer',
                fields: { 
                  keyword: { type: 'keyword' },
                  suggest: { 
                    type: 'text',
                    analyzer: 'vietnamese_autocomplete'
                  }
                }
              },
              description: { 
                type: 'text',
                analyzer: 'vietnamese_analyzer',
                search_analyzer: 'vietnamese_search_analyzer'
              },
              price_range: { type: 'keyword' },
              adult_price: { type: 'double' },
              child_price: { type: 'double' },
              infant_price: { type: 'double' },
              duration: { type: 'integer' },
              start_date: { type: 'date' },
              end_date: { type: 'date' },
              max_guests: { type: 'integer' },
              booked_slots: { type: 'integer' },
              transport: { type: 'keyword' },
              status: { type: 'keyword' },
              branch_id: { type: 'integer' },
              created_at: { type: 'date' },
              cover_image: { type: 'keyword' },
              categories: { 
                type: 'keyword',
                fields: {
                  text: {
                    type: 'text',
                    analyzer: 'vietnamese_analyzer'
                  }
                }
              },
              // Thêm field tổng hợp để tìm kiếm
              all_text: {
                type: 'text',
                analyzer: 'vietnamese_analyzer',
                search_analyzer: 'vietnamese_search_analyzer'
              },
              // Field cho popularity score
              popularity_score: { type: 'float' },
              // Field cho quality score
              quality_score: { type: 'float' }
            }
          }
        }
      });
      console.log(`✅ Index ${indexName} created successfully with Vietnamese analyzer`);
    } else {
      console.log(`✅ Index ${indexName} already exists`);
    }
  } catch (error) {
    console.error('❌ Error creating index:', error.message);
    throw error;
  }
};

module.exports = {
  client,
  testConnection,
  createTourIndex,
  INDEX_NAME: 'tour_index'
}; 