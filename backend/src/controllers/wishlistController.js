const { Customer } = require("../models/User");
const Product = require("../models/Product");

const getWishlist = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.user._id).populate({
      path: "wishlist",
      match: { isActive: true },
      select: "name price originalPrice imageUrl rating numReviews category countInStock brand",
    });

    if (!customer) {
      res.status(404);
      throw new Error("Customer not found");
    }

    res.json(customer.wishlist || []);
  } catch (error) {
    next(error);
  }
};

const toggleWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      res.status(400);
      throw new Error("Product ID is required");
    }

    const product = await Product.findById(productId);
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    const customer = await Customer.findById(req.user._id);
    if (!customer) {
      res.status(404);
      throw new Error("Customer not found");
    }

    const index = customer.wishlist.findIndex(
      (id) => id.toString() === productId.toString()
    );

    let isAdded = false;
    if (index > -1) {
      customer.wishlist.splice(index, 1);
      isAdded = false;
    } else {
      customer.wishlist.push(productId);
      isAdded = true;
    }

    await customer.save();

    res.json({
      message: isAdded ? "Product added to wishlist" : "Product removed from wishlist",
      wishlist: customer.wishlist,
      isAdded,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getWishlist, toggleWishlist };
