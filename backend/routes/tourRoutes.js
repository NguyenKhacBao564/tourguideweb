const express = require("express");
const router = express.Router();
const { getTour, createTour, getTourById, deleteTour, blockTour, updateTour } = require("../controller/tourController");

const { getImages } = require("../controller/imageController");

const upload = require("../middlewares/upload");

router.get("/", getTour);
router.post("/", upload.array("image",10), createTour);
router.get("/:id", getTourById);
router.delete("/:id", deleteTour);
router.put("/:id", blockTour);
router.put("/update/:id", upload.array("image",10), updateTour);
router.get("/images/:id", getImages);
// router.put("/upload-image/:id", upload.single("image"), );
module.exports = router;