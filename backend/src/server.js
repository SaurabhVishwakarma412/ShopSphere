const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV === "production") {
  const requiredEnvironment = ["MONGO_URI", "JWT_SECRET", "CLIENT_URL"];
  const missingEnvironment = requiredEnvironment.filter((key) => !process.env[key]);
  if (missingEnvironment.length) {
    throw new Error(`Missing required environment variables: ${missingEnvironment.join(", ")}`);
  }
}

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`API running on http://localhost:${PORT}`);
  });
});
