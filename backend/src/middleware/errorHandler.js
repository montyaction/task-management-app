// Handle non-existing routes
export const notFound = (req, res, next) => {
  res.status(404).json({ message: "Route not found" });
};

// General error handler
export const errorHandler = (err, req, res, next) => {
  console.error(err.stack || err);

  const status = err.status || 500;
  const message = err.message || "Internal Server Error";

  res.status(status).json({ message });
};
