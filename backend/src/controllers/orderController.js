const Order = require("../models/Order");
const Product = require("../models/Product");

const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;
    if (!items?.length) {
      res.status(400);
      throw new Error("Order must include at least one item");
    }

    const invalidItem = items.find((item) => !item.product || !Number.isInteger(Number(item.quantity)) || Number(item.quantity) < 1);
    if (invalidItem) {
      res.status(400);
      throw new Error("Each order item must include a product and quantity of at least 1");
    }

    const ids = items.map((item) => item.product);
    const products = await Product.find({ _id: { $in: ids }, isActive: true });
    const orderItems = items.map((item) => {
      const product = products.find((p) => p._id.toString() === item.product);
      const quantity = Number(item.quantity);
      if (!product) throw new Error("One or more products are unavailable");
      if (product.countInStock < quantity) {
        throw new Error(`${product.name} has only ${product.countInStock} item(s) left`);
      }
      return {
        product: product._id,
        seller: product.seller,
        name: product.name,
        imageUrl: product.imageUrl,
        price: product.price,
        quantity,
      };
    });

    const itemsPrice = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingPrice = itemsPrice > 999 ? 0 : 79;
    const taxPrice = Number((itemsPrice * 0.18).toFixed(2));
    const totalPrice = Number((itemsPrice + shippingPrice + taxPrice).toFixed(2));

    const order = await Order.create({
      customer: req.user._id,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    });

    await Promise.all(
      orderItems.map((item) =>
        Product.findByIdAndUpdate(item.product, { $inc: { countInStock: -item.quantity } })
      )
    );

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ customer: req.user._id }).sort("-createdAt");
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

const getSellerOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ "items.seller": req.user._id })
      .populate("customer", "name email")
      .sort("-createdAt");
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }
    const ownsItem = order.items.some((item) => item.seller.toString() === req.user._id.toString());
    if (!ownsItem) {
      res.status(403);
      throw new Error("You can update only orders containing your products");
    }
    order.orderStatus = req.body.orderStatus || order.orderStatus;
    await order.save();
    res.json(order);
  } catch (error) {
    next(error);
  }
};

module.exports = { createOrder, getMyOrders, getSellerOrders, updateOrderStatus };
