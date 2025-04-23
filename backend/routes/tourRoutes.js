const express = require("express");
const router = express.Router();
const { getTour, createTour, getTourById, deleteTour, blockTour, updateTour } = require("../controller/tourController");

router.get("/", getTour);
router.post("/", createTour);
router.get("/:id", getTourById);
router.delete("/:id", deleteTour);
router.put("/:id", blockTour);
router.put("/update/:id", updateTour);

module.exports = router;