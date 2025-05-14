const express = require('express');
const router = express.Router();
const { getPromotion } = require('../controller/promotionController');


router.get('/', getPromotion);



module.exports = router;