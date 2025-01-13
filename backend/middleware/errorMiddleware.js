const errorMiddleware = (err, req, res, next) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).json({
      success: false,
      error: err.message || "Server Error",
    });
  };
  
  module.exports = errorMiddleware;
  