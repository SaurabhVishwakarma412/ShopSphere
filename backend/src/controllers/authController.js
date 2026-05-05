const User = require("../models/User");
const generateToken = require("../utils/generateToken");

const sendAuth = (res, user) => {
  res.json({
    token: generateToken(user),
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      address: user.address,
    },
  });
};

const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const exists = await User.findOne({ email });
    if (exists) {
      res.status(400);
      throw new Error("Email already registered");
    }
    const user = await User.create({ name, email, password, role });
    res.status(201);
    sendAuth(res, user);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      res.status(401);
      throw new Error("Invalid email or password");
    }
    sendAuth(res, user);
  } catch (error) {
    next(error);
  }
};

const me = async (req, res) => {
  res.json({ user: req.user });
};

const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
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
