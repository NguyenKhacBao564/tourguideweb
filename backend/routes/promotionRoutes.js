const express = require('express');
const router = express.Router();
const { getPromotion, createPromotion, blockPromotion, updatePromotion } = require('../controller/promotionController');


router.get('/', getPromotion);
router.post('/',  createPromotion)
router.put('/:promotionId', updatePromotion);
router.put('/:promotionId', blockPromotion);

module.exports = router;