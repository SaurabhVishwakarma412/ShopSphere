const { getAccountModel } = require("../models/User");
const generateToken = require("../utils/generateToken");

const normalizeEmail = (email = "") => email.trim().toLowerCase();

const sendAuth = (res, user) => {
  res.json({
    token: generateToken(user),
    user: user.toAuthJSON(),
  });
};

const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const normalizedEmail = normalizeEmail(email);
    const Account = getAccountModel(role);
    const exists = await Account.findOne({ email: normalizedEmail });
    if (exists) {
      res.status(400);
      throw new Error(`Email already registered as a ${role || "customer"}`);
    }
    const user = await Account.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
    });
    res.status(201);
    sendAuth(res, user);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400);
      error.message = `Email already registered as a ${req.body.role || "customer"}`;
    }
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;
    const Account = getAccountModel(role);
    const user = await Account.findOne({ email: normalizeEmail(email) }).select("+password");
    if (!user || !(await user.matchPassword(password))) {
      res.status(401);
      throw new Error(`Invalid ${role || "customer"} email or password`);
    }
    sendAuth(res, user);
  } catch (error) {
    next(error);
  }
};

const me = async (req, res) => {
  res.json({ user: req.user.toAuthJSON() });
};

const updateProfile = async (req, res, next) => {
  try {
    const Account = getAccountModel(req.user.role);
    const user = await Account.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    user.name = req.body.name ?? user.name;
    user.phone = req.body.phone ?? user.phone;
    user.address = { ...(user.address?.toObject?.() || {}), ...(req.body.address || {}) };
    await user.save();
    sendAuth(res, user);
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, me, updateProfile };
