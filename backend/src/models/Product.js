const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "Seller", required: true },
    name: { type: String, required: true, trim: true },
    brand: { type: String, default: "", trim: true },
    category: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, min: 0, default: null },
    countInStock: { type: Number, required: true, min: 0 },
    sku: { type: String, default: "", trim: true },
    imageUrl: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80",
    },
    images: {
      type: [String],
      default: [],
    },
    colors: {
      type: [String],
      default: [],
    },
    sizes: {
      type: [String],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
    },
    features: {
      type: [String],
      default: [],
    },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
