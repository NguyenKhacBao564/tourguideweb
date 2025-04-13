const express = require("express");
const router = express.Router();
const { getTour, createTour, getTourById, deleteTour } = require("../controller/tourController");

router.get("/", getTour);
router.post("/", createTour);
router.get("/:id", getTourById);
router.delete("/:id", deleteTour);


module.exports = router;