// Handle non-existing routes
export const notFound = (req, res, _next) => {
  res.status(404).json({ message: "Route not found" });
};

// General error handler
export const errorHandler = (err, req, res, _next) => {
  console.error(err.stack || err);

  const status = err.status || (err.message === "CORS origin not allowed" ? 403 : 500);
  const message = err.message || "Internal Server Error";

  res.status(status).json({ message });
};
