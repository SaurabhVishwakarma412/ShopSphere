const Product = require("../models/Product");

const getProducts = async (req, res, next) => {
  try {
    const { search = "", category = "", seller = "" } = req.query;
    const query = { isActive: true };
    if (search) {
      const searchRegex = { $regex: search, $options: "i" };
      query.$or = [{ name: searchRegex }, { brand: searchRegex }, { category: searchRegex }];
    }
    if (category) query.category = category;
    if (seller) query.seller = seller;
    const products = await Product.find(query).populate("seller", "name email").sort("-createdAt");
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
    const product = await Product.findById(req.params.id).populate("seller", "name email");
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
    const product = await Product.create({ ...req.body, seller: req.user._id });
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
