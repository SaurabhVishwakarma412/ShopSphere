const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const { getCloudinaryConfigStatus } = require("./config/cloudinary");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173,http://localhost:3000")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes("*")) {
        return callback(null, true);
      }
      return callback(new Error("Origin is not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/", (_req, res) => {
  res.json({ message: "ShopSphere E-Commerce API is running smoothly", status: "ok" });
});

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "shopsphere-api",
    timestamp: new Date().toISOString(),
    cloudinary: getCloudinaryConfigStatus(),
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/wishlist", wishlistRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
