const jwt = require("jsonwebtoken");
const { getAccountModel } = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    res.status(401);
    return next(new Error("Not authorized, token missing"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev_only_change_this_secret");
    const Account = getAccountModel(decoded.role);
    req.user = await Account.findById(decoded.id);
    if (!req.user) {
      res.status(401);
      return next(new Error("User no longer exists"));
    }
    next();
  } catch (error) {
    res.status(401);
    next(new Error("Not authorized, token invalid"));
  }
};

const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    res.status(403);
    return next(new Error("You do not have permission for this action"));
  }
  next();
};

module.exports = { protect, authorize };
