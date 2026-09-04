const Product = require("../models/Product");
const Review = require("../models/Review");

const uploadedImageUrls = (req, files = []) => {
  const baseUrl = process.env.SERVER_URL || `${req.protocol}://${req.get("host")}`;
  return files.map((file) => `${baseUrl}/uploads/products/${file.filename}`);
};

const parseArrayField = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value.map((v) => String(v).trim()).filter(Boolean);
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed.map((v) => String(v).trim()).filter(Boolean);
    } catch {
      return value.split(",").map((v) => v.trim()).filter(Boolean);
    }
  }
  return [];
};

const getProducts = async (req, res, next) => {
  try {
    const {
      search = "",
      category = "",
      seller = "",
      sort = "newest",
      minPrice,
      maxPrice,
      rating,
      tag,
    } = req.query;

    const query = { isActive: true };

    if (search) {
      const searchRegex = { $regex: search, $options: "i" };
      query.$or = [
        { name: searchRegex },
        { brand: searchRegex },
        { category: searchRegex },
        { tags: { $in: [searchRegex] } },
      ];
    }

    if (category) {
      query.category = { $regex: `^${category}$`, $options: "i" };
    }

    if (tag) {
      query.tags = { $in: [new RegExp(`^${tag}$`, "i")] };
    }

    if (seller) query.seller = seller;

    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined && minPrice !== "") query.price.$gte = Number(minPrice);
      if (maxPrice !== undefined && maxPrice !== "") query.price.$lte = Number(maxPrice);
    }

    if (rating !== undefined && rating !== "") {
      query.rating = { $gte: Number(rating) };
    }

    const sortOptions = {
      newest: { createdAt: -1 },
      price_asc: { price: 1 },
      price_desc: { price: -1 },
      rating: { rating: -1, numReviews: -1 },
      popular: { numReviews: -1, rating: -1 },
    };

    const products = await Product.find(query)
      .populate("seller", "name email")
      .sort(sortOptions[sort] || sortOptions.newest)
      .limit(100);

    res.json(products);
  } catch (error) {
    next(error);
  }
};

const getCategories = async (_req, res, next) => {
  try {
    const categories = await Product.distinct("category", { isActive: true });
    res.json(categories.filter(Boolean));
  } catch (error) {
    next(error);
  }
};

const getSellerProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ seller: req.user._id }).sort("-createdAt");
    res.json(products);
  } catch (error) {
    next(error);
  }
};

const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, isActive: true }).populate(
      "seller",
      "name email"
    );
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const files = req.files || [];
    const images = uploadedImageUrls(req, files);

    const colors = parseArrayField(req.body.colors);
    const sizes = parseArrayField(req.body.sizes);
    const tags = parseArrayField(req.body.tags);
    const features = parseArrayField(req.body.features);

    // Fallback: If imageUrl is passed in body, use it, or first uploaded image
    let imageUrl = req.body.imageUrl;
    if (images.length > 0) {
      imageUrl = images[0];
    }

    const productData = {
      name: req.body.name,
      brand: req.body.brand || "",
      category: req.body.category,
      description: req.body.description,
      price: Number(req.body.price),
      originalPrice: req.body.originalPrice ? Number(req.body.originalPrice) : null,
      countInStock: Number(req.body.countInStock),
      sku: req.body.sku || "",
      seller: req.user._id,
      colors,
      sizes,
      tags,
      features,
    };

    if (imageUrl) {
      productData.imageUrl = imageUrl;
    }
    if (images.length > 0) {
      productData.images = images;
    }

    const product = await Product.create(productData);
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }
    if (product.seller.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("You can update only your own products");
    }

    const standardFields = [
      "name",
      "brand",
      "category",
      "description",
      "price",
      "originalPrice",
      "countInStock",
      "sku",
      "imageUrl",
      "isActive",
    ];

    standardFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        if (field === "price" || field === "countInStock" || field === "originalPrice") {
          product[field] = req.body[field] ? Number(req.body[field]) : (field === "originalPrice" ? null : 0);
        } else {
          product[field] = req.body[field];
        }
      }
    });

    if (req.body.colors !== undefined) product.colors = parseArrayField(req.body.colors);
    if (req.body.sizes !== undefined) product.sizes = parseArrayField(req.body.sizes);
    if (req.body.tags !== undefined) product.tags = parseArrayField(req.body.tags);
    if (req.body.features !== undefined) product.features = parseArrayField(req.body.features);

    const images = uploadedImageUrls(req, req.files);
    if (images.length) {
      product.images = [...(product.images || []), ...images];
      if (!product.imageUrl || product.imageUrl.includes("unsplash")) {
        product.imageUrl = images[0];
      }
    }

    await product.save();
    res.json(product);
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }
    if (product.seller.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("You can delete only your own products");
    }
    await product.deleteOne();
    await Review.deleteMany({ product: req.params.id });
    res.json({ message: "Product deleted" });
  } catch (error) {
    next(error);
  }
};

const getProductReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ product: req.params.id }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    next(error);
  }
};

const createProductReview = async (req, res, next) => {
  try {
    const { rating, comment, title = "" } = req.body;
    const productId = req.params.id;

    if (!rating || Number(rating) < 1 || Number(rating) > 5) {
      res.status(400);
      throw new Error("Please provide a rating between 1 and 5");
    }
    if (!comment || !comment.trim()) {
      res.status(400);
      throw new Error("Please provide a review comment");
    }

    const product = await Product.findById(productId);
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    let review = await Review.findOne({ product: productId, user: req.user._id });
    if (review) {
      review.rating = Number(rating);
      review.comment = comment.trim();
      review.title = title.trim();
      review.userName = req.user.name;
      await review.save();
    } else {
      review = await Review.create({
        product: productId,
        user: req.user._id,
        userName: req.user.name,
        rating: Number(rating),
        title: title.trim(),
        comment: comment.trim(),
      });
    }

    const allReviews = await Review.find({ product: productId });
    product.numReviews = allReviews.length;
    product.rating = Number(
      (allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length).toFixed(1)
    );
    await product.save();

    res.status(201).json({
      message: "Review submitted successfully",
      review,
      productRating: product.rating,
      productNumReviews: product.numReviews,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getCategories,
  getSellerProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductReviews,
  createProductReview,
};
