const express = require("express");
const { body } = require("express-validator");
const { register, login, me, updateProfile } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const validate = require("../middleware/validateMiddleware");

const router = express.Router();

router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").trim().isEmail().withMessage("Valid email is required").normalizeEmail(),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    body("role").optional().isIn(["customer", "seller"]).withMessage("Role must be customer or seller"),
  ],
  validate,
  register
);
router.post(
  "/login",
  [
    body("email").trim().isEmail().withMessage("Valid email is required").normalizeEmail(),
    body("password").notEmpty().withMessage("Password is required"),
    body("role").isIn(["customer", "seller"]).withMessage("Choose customer or seller login"),
  ],
  validate,
  login
);
router.get("/me", protect, me);
router.put("/profile", protect, updateProfile);

module.exports = router;
