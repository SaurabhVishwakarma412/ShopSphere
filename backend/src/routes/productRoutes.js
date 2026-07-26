const express = require("express");
const { body } = require("express-validator");
const {
  getProducts,
  getSellerProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { protect, authorize } = require("../middleware/authMiddleware");
const validate = require("../middleware/validateMiddleware");
const { productImageUpload } = require("../middleware/uploadMiddleware");

const router = express.Router();

const productRules = [
  body("name").notEmpty().withMessage("Product name is required"),
  body("category").notEmpty().withMessage("Category is required"),
  body("description").notEmpty().withMessage("Description is required"),
  body("price").isFloat({ min: 0 }).withMessage("Price must be valid"),
  body("countInStock").isInt({ min: 0 }).withMessage("Stock must be valid"),
];

router.get("/", getProducts);
router.get("/mine", protect, authorize("seller"), getSellerProducts);
router.get("/:id", getProduct);
router.post("/", protect, authorize("seller"), productImageUpload.array("images", 5), productRules, validate, createProduct);
router.put("/:id", protect, authorize("seller"), productImageUpload.array("images", 5), productRules, validate, updateProduct);
router.delete("/:id", protect, authorize("seller"), deleteProduct);

module.exports = router;
