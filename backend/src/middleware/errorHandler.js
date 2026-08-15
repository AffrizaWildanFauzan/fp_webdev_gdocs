export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}`;
    error = { message, statusCode: 404 };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    const message = `Duplicate field value entered for ${field}`;
    error = { message, statusCode: 400 };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = { message: message.join(', '), statusCode: 400 };
  }

  const statusCode = error.statusCode || 500;
  const message = error.message || 'Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};