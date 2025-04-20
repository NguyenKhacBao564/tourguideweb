const express = require("express");
const router = express.Router();
const {getCustomer, deleteBatchCustomer, deleteCustomer} = require("../controller/customerController");

router.get("/", getCustomer);
router.delete("/batch-delete", deleteBatchCustomer);    
router.delete("/:id", deleteCustomer);
module.exports = router;