const notFound = (req, res, next) => {
  res.status(404);
  next(new Error(`Route not found: ${req.originalUrl}`));
};

const errorHandler = (err, req, res, _next) => {
  const isUploadError = err.name === "MulterError" || err.message === "Only image files can be uploaded";
  const statusCode = res.statusCode === 200 ? (isUploadError ? 400 : 500) : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
};

module.exports = { notFound, errorHandler };
