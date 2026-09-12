// const app = require("./app");
// const connectDB = require("./config/db");

// const PORT = process.env.PORT || 5000;

// if (process.env.NODE_ENV === "production") {
//   const requiredEnvironment = ["MONGO_URI", "JWT_SECRET", "CLIENT_URL"];
//   const missingEnvironment = requiredEnvironment.filter((key) => !process.env[key]);
//   if (missingEnvironment.length) {
//     throw new Error(`Missing required environment variables: ${missingEnvironment.join(", ")}`);
//   }
// }

// connectDB().then(() => {
//   app.listen(PORT, () => {
//     console.log(`API running on http://localhost:${PORT}`);
//   });
// });


const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const hasEnv = (key) => Boolean(process.env[key]?.trim());

const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV === "production") {
  const requiredEnvironment = [
    "MONGO_URI",
    "JWT_SECRET",
    "CLIENT_URL"
  ];

  const missingEnvironment = requiredEnvironment.filter(
    (key) => !process.env[key]
  );

  const hasCloudinaryEnvironment =
    hasEnv("CLOUDINARY_URL") ||
    (
      hasEnv("CLOUDINARY_CLOUD_NAME") &&
      hasEnv("CLOUDINARY_API_KEY") &&
      hasEnv("CLOUDINARY_API_SECRET")
    );

  if (!hasCloudinaryEnvironment) {
    missingEnvironment.push(
      "CLOUDINARY_URL or CLOUDINARY_CLOUD_NAME/CLOUDINARY_API_KEY/CLOUDINARY_API_SECRET"
    );
  }

  if (missingEnvironment.length) {
    throw new Error(
      `Missing required environment variables: ${missingEnvironment.join(", ")}`
    );
  }
}

connectDB().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`API running on port ${PORT}`);
  });
});
