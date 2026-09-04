const jwt = require("jsonwebtoken");

const getJwtSecret = () => {
  if (process.env.JWT_SECRET) return process.env.JWT_SECRET;
  if (process.env.NODE_ENV !== "production") return "local-development-secret-change-me";
  throw new Error("JWT_SECRET is required in production");
};

const generateToken = (user) =>
  jwt.sign(
    { id: user._id, role: user.role },
    getJwtSecret(),
    {
      expiresIn: "7d",
    }
  );

module.exports = generateToken;
module.exports.getJwtSecret = getJwtSecret;
