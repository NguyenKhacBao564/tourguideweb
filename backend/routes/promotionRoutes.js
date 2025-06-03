const express = require('express');
const router = express.Router();
const { getPromotion, createPromotion, blockPromotion, blockBatchPromotion, updatePromotion } = require('../controller/promotionController');


router.get('/', getPromotion);
router.post('/',  createPromotion)
router.put('/update/:promotionId', updatePromotion);
router.put('/block/:promotionId', blockPromotion);
router.put('/block_batch', blockBatchPromotion);

module.exports = router;