const Order = require("../models/Order");
const Product = require("../models/Product");

const createOrder = async (req, res, next) => {
  const reservedItems = [];
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

    const requiredAddressFields = ["street", "city", "state", "pincode"];
    if (!shippingAddress || requiredAddressFields.some((field) => !String(shippingAddress[field] || "").trim())) {
      res.status(400);
      throw new Error("A complete shipping address is required");
    }
    if (!["card", "upi", "cash"].includes(paymentMethod)) {
      res.status(400);
      throw new Error("Unsupported payment method");
    }

    const quantities = items.reduce((result, item) => {
      result[item.product] = (result[item.product] || 0) + Number(item.quantity);
      return result;
    }, {});
    const ids = Object.keys(quantities);
    const products = await Product.find({ _id: { $in: ids }, isActive: true });
    if (products.length !== ids.length) {
      throw new Error("One or more products are unavailable");
    }
    const orderItems = [];
    for (const product of products) {
      const quantity = quantities[product._id.toString()];
      if (!quantity) throw new Error("One or more products are unavailable");
      const reserved = await Product.findOneAndUpdate(
        { _id: product._id, isActive: true, countInStock: { $gte: quantity } },
        { $inc: { countInStock: -quantity } },
        { new: true },
      );
      if (!reserved) throw new Error(`${product.name} does not have enough stock`);
      reservedItems.push({ product: product._id, quantity });
      orderItems.push({
        product: product._id,
        seller: product.seller,
        name: product.name,
        imageUrl: product.imageUrl,
        price: product.price,
        quantity,
      });
    }

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

    res.status(201).json(order);
  } catch (error) {
    if (reservedItems.length) {
      await Promise.all(
        reservedItems.map((item) => Product.findByIdAndUpdate(item.product, { $inc: { countInStock: item.quantity } }))
      );
    }
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
    const allowedStatuses = ["placed", "packed", "shipped", "delivered", "cancelled"];
    if (!allowedStatuses.includes(req.body.orderStatus)) {
      res.status(400);
      throw new Error("Invalid order status");
    }
    order.orderStatus = req.body.orderStatus;
    await order.save();
    res.json(order);
  } catch (error) {
    next(error);
  }
};

const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, customer: req.user._id });
    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }
    if (!["placed", "packed"].includes(order.orderStatus)) {
      res.status(400);
      throw new Error("This order can no longer be cancelled");
    }
    order.orderStatus = "cancelled";
    await order.save();
    await Promise.all(order.items.map((item) => Product.findByIdAndUpdate(item.product, { $inc: { countInStock: item.quantity } })));
    res.json(order);
  } catch (error) {
    next(error);
  }
};

module.exports = { createOrder, getMyOrders, getSellerOrders, updateOrderStatus, cancelOrder };
