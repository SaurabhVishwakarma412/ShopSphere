const { v2: cloudinary } = require("cloudinary");

const readEnv = (key) => process.env[key]?.trim();

const hasCloudinaryConfig = () =>
  Boolean(
    readEnv("CLOUDINARY_URL") ||
      (readEnv("CLOUDINARY_CLOUD_NAME") &&
        readEnv("CLOUDINARY_API_KEY") &&
        readEnv("CLOUDINARY_API_SECRET"))
  );

const getCloudinaryConfigStatus = () => ({
  configured: hasCloudinaryConfig(),
  hasCloudinaryUrl: Boolean(readEnv("CLOUDINARY_URL")),
  hasCloudName: Boolean(readEnv("CLOUDINARY_CLOUD_NAME")),
  hasApiKey: Boolean(readEnv("CLOUDINARY_API_KEY")),
  hasApiSecret: Boolean(readEnv("CLOUDINARY_API_SECRET")),
});

const configureCloudinary = () => {
  if (!hasCloudinaryConfig()) return false;

  if (readEnv("CLOUDINARY_URL")) {
    cloudinary.config({ secure: true });
    return true;
  }

  cloudinary.config({
    cloud_name: readEnv("CLOUDINARY_CLOUD_NAME"),
    api_key: readEnv("CLOUDINARY_API_KEY"),
    api_secret: readEnv("CLOUDINARY_API_SECRET"),
    secure: true,
  });

  return true;
};

const uploadProductImage = (file) => {
  if (!configureCloudinary()) {
    throw new Error("Cloudinary credentials are required to upload product images");
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: process.env.CLOUDINARY_PRODUCT_FOLDER || "ecommerce/products",
        resource_type: "image",
        use_filename: true,
        unique_filename: true,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    );

    uploadStream.end(file.buffer);
  });
};

const deleteProductImages = async (publicIds = []) => {
  if (!publicIds.length || !configureCloudinary()) return;
  await Promise.all(publicIds.map((publicId) => cloudinary.uploader.destroy(publicId)));
};

module.exports = {
  uploadProductImage,
  deleteProductImages,
  getCloudinaryConfigStatus,
};
