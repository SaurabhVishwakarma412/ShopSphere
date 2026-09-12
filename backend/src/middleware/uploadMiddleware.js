const multer = require("multer");

const imageFileFilter = (_req, file, callback) => {
  if (file.mimetype.startsWith("image/")) return callback(null, true);
  callback(new Error("Only image files can be uploaded"));
};

const productImageUpload = multer({
  storage: multer.memoryStorage(),
  fileFilter: imageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = { productImageUpload };
