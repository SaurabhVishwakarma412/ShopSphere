const path = require("path");
const fs = require("fs");
const multer = require("multer");

const uploadDirectory = path.join(__dirname, "../../uploads/products");
fs.mkdirSync(uploadDirectory, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => callback(null, uploadDirectory),
  filename: (_req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    callback(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`);
  },
});

const imageFileFilter = (_req, file, callback) => {
  if (file.mimetype.startsWith("image/")) return callback(null, true);
  callback(new Error("Only image files can be uploaded"));
};

const productImageUpload = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = { productImageUpload };
