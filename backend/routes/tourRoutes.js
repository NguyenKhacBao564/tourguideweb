const express = require("express");
const router = express.Router();
const { getTour, createTour, getTourById, blockTour, updateTour, getTourByProvince, getTourOutstanding } = require("../controller/tourController");

const { getTourImages } = require("../controller/imageController");

const upload = require("../middlewares/upload");

router.get("/", getTour);
router.get("/outstanding", getTourOutstanding);
router.get("/province/:province", getTourByProvince);
router.post("/", upload.array("image",10), createTour);
router.get("/:id", getTourById);
router.put("/:id", blockTour);
router.put("/update/:id", upload.array("image",10), updateTour);
router.get("/images/:id", getTourImages);

// router.put("/upload-image/:id", upload.single("image"), );
module.exports = router;