const express = require('express');
const router = express.Router();
const {
  initializeElasticsearch,
  syncTours,
  searchTours,
  compareSearch,
  getSuggestions,
  getElasticsearchStats,
  testVietnameseAnalyzer,
  resetElasticsearch,
  debugIndexing
} = require('../controller/elasticsearchController');

// Khởi tạo Elasticsearch (chạy một lần khi setup)
router.post('/initialize', initializeElasticsearch);

// Đồng bộ tours từ SQL Server vào Elasticsearch
router.post('/sync', syncTours);

// Tìm kiếm tours với Elasticsearch
router.get('/search', searchTours);

// So sánh kết quả tìm kiếm SQL vs Elasticsearch (cho báo cáo)
router.get('/compare', compareSearch);

// Lấy gợi ý tìm kiếm
router.get('/suggestions', getSuggestions);

// Thống kê Elasticsearch
router.get('/stats', getElasticsearchStats);

// Test Vietnamese analyzer
router.post('/test-analyzer', testVietnameseAnalyzer);

// Reset Elasticsearch (xóa và tạo lại index)
router.post('/reset', resetElasticsearch);

// Debug indexing
router.post('/debug', debugIndexing);

// Test connection route
router.get('/test', (req, res) => {
  res.json({ message: 'Elasticsearch API is working!', timestamp: new Date().toISOString() });
});

// Sync single tour by ID
router.post('/sync-tour/:tourId', async (req, res) => {
  try {
    const { tourId } = req.params;
    const elasticsearchService = require('../services/elasticsearchService');
    
    const result = await elasticsearchService.syncSingleTour(tourId);
    
    if (result.success) {
      res.json({ 
        message: `Successfully synced tour ${tourId}`, 
        success: true 
      });
    } else {
      res.status(404).json({ 
        message: `Tour ${tourId} not found`, 
        success: false 
      });
    }
  } catch (error) {
    console.error(`Error syncing tour ${req.params.tourId}:`, error);
    res.status(500).json({ 
      message: `Error syncing tour: ${error.message}`, 
      success: false 
    });
  }
});

// Check sync status - compare database vs Elasticsearch
router.get('/sync-status', async (req, res) => {
  try {
    const { getPool, sql } = require('../config/db');
    const { client, INDEX_NAME } = require('../config/elasticsearch');
    
    // Get all tour IDs from database
    const pool = await getPool();
    const dbResult = await pool.request().query(`
      SELECT tour_id, name, status, created_at 
      FROM Tour 
      WHERE status IN ('active', 'upcoming')
      ORDER BY created_at DESC
    `);
    
    const dbTours = dbResult.recordset;
    
    // Get all tour IDs from Elasticsearch
    const esResult = await client.search({
      index: INDEX_NAME,
      body: {
        query: { match_all: {} },
        size: 1000,
        _source: ['tour_id', 'name', 'status']
      }
    });
    
    const esTours = (esResult.body?.hits?.hits || esResult.hits?.hits || []).map(hit => hit._source);
    const esIds = new Set(esTours.map(tour => tour.tour_id));
    
    // Find missing tours
    const missingInES = dbTours.filter(tour => !esIds.has(tour.tour_id));
    const extraInES = esTours.filter(tour => !dbTours.find(dbTour => dbTour.tour_id === tour.tour_id));
    
    res.json({
      database: {
        total: dbTours.length,
        tours: dbTours.slice(0, 10) // Show first 10
      },
      elasticsearch: {
        total: esTours.length,
        tours: esTours.slice(0, 10) // Show first 10
      },
      sync_status: {
        in_sync: missingInES.length === 0 && extraInES.length === 0,
        missing_in_elasticsearch: missingInES.length,
        extra_in_elasticsearch: extraInES.length,
        missing_tours: missingInES.slice(0, 10), // Show first 10
        extra_tours: extraInES.slice(0, 10) // Show first 10
      }
    });
    
  } catch (error) {
    console.error('Error checking sync status:', error);
    res.status(500).json({ 
      message: `Error checking sync status: ${error.message}`, 
      success: false 
    });
  }
});

module.exports = router; 