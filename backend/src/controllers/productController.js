const Product = require("../models/Product");

const uploadedImageUrls = (req, files = []) => {
  const baseUrl = process.env.SERVER_URL || `${req.protocol}://${req.get("host")}`;
  return files.map((file) => `${baseUrl}/uploads/products/${file.filename}`);
};

const getProducts = async (req, res, next) => {
  try {
    const { search = "", category = "", seller = "", sort = "newest" } = req.query;
    const query = { isActive: true };
    if (search) {
      const searchRegex = { $regex: search, $options: "i" };
      query.$or = [{ name: searchRegex }, { brand: searchRegex }, { category: searchRegex }];
    }
    if (category) query.category = category;
    if (seller) query.seller = seller;
    const sortOptions = {
      newest: { createdAt: -1 },
      price_asc: { price: 1 },
      price_desc: { price: -1 },
      rating: { rating: -1, numReviews: -1 },
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
    const product = await Product.findOne({ _id: req.params.id, isActive: true }).populate("seller", "name email");
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
    const images = uploadedImageUrls(req, req.files);
    const product = await Product.create({
      ...req.body,
      ...(images.length && { images, imageUrl: images[0] }),
      seller: req.user._id,
    });
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
    const allowedFields = [
      "name",
      "brand",
      "category",
      "description",
      "price",
      "countInStock",
      "imageUrl",
      "isActive",
    ];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) product[field] = req.body[field];
    });
    const images = uploadedImageUrls(req, req.files);
    if (images.length) {
      product.images = images;
      product.imageUrl = images[0];
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
    res.json({ message: "Product deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getSellerProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
