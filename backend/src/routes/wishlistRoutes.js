const express = require("express");
const { getWishlist, toggleWishlist } = require("../controllers/wishlistController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, authorize("customer"), getWishlist);
router.post("/toggle", protect, authorize("customer"), toggleWishlist);

module.exports = router;
