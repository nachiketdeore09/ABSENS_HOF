import ApiResponse from '../utils/apiResponse.js';

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log to console for dev
  console.error(err.stack.red);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}`;
    return ApiResponse.error(res, 404, message);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    return ApiResponse.error(res, 400, 'Validation Error', messages);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${field} already exists`;
    return ApiResponse.error(res, 400, message);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return ApiResponse.error(res, 401, 'Invalid token');
  }

  if (err.name === 'TokenExpiredError') {
    return ApiResponse.error(res, 401, 'Token expired');
  }

  // Cloudinary errors
  if (err.name === 'CloudinaryError') {
    return ApiResponse.error(res, 500, 'File upload failed');
  }

  // Default to 500 server error
  ApiResponse.error(res, error.statusCode || 500, error.message || 'Server Error');
};

export default errorHandler;