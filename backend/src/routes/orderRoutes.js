const express = require("express");
const { createOrder, getMyOrders, getSellerOrders, updateOrderStatus, cancelOrder } = require("../controllers/orderController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, authorize("customer"), createOrder);
router.get("/mine", protect, authorize("customer"), getMyOrders);
router.get("/seller", protect, authorize("seller"), getSellerOrders);
router.put("/:id/cancel", protect, authorize("customer"), cancelOrder);
router.put("/:id/status", protect, authorize("seller"), updateOrderStatus);

module.exports = router;
