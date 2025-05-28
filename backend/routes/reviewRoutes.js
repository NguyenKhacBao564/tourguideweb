const express = require("express");
const router = express.Router();
const { getAllReviewsByTourId, getReviewById, addReview } = require("../controller/ReviewController");

router.get("/:id", getAllReviewsByTourId);
router.get("/review/:id", getReviewById);
router.post("/", addReview);

module.exports = router;