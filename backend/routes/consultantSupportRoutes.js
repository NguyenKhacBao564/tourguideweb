const express = require("express");
const router = express.Router();
const {
    getSupportRequests,
    updateSupportRequestStatus,
    createSupportResponse,
} = require("../services/consultantSupportService");

// Route cho nhân viên tư vấn
router.get("/requests", getSupportRequests);
router.put("/request/:requestId/status", updateSupportRequestStatus);
router.post("/response", createSupportResponse);

module.exports = router;