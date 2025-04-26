const express = require("express");
const router = express.Router();
const {getCustomer, deleteBatchCustomer, deleteCustomer, getAvatar} = require("../controller/customerController");


router.get("/", getCustomer);
router.get("/:id", getAvatar);
router.delete("/batch-delete", deleteBatchCustomer);    
router.delete("/:id", deleteCustomer);


module.exports = router;