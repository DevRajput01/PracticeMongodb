const AppError = require('../utils/AppError');

// Handle MongoDB duplicate key error
const handleDuplicateKeyError = (err) => {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    const message = `${field} '${value}' already exists. Please use another ${field}`;
    return new AppError(message, 400);
};

// Handle MongoDB validation error
const handleValidationError = (err) => {
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Invalid input data: ${errors.join('. ')}`;
    return new AppError(message, 400);
};

// Handle CastError (invalid ID)
const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new AppError(message, 400);
};

// Send error response in development
const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        success: false,
        status: err.status,
        message: err.message,
        error: err,
        stack: err.stack
    });
};

// Send error response in production
const sendErrorProd = (err, res) => {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
        res.status(err.statusCode).json({
            success: false,
            status: err.status,
            message: err.message
        });
    } else {
        // Programming or other unknown error: don't leak error details
        console.error('ERROR 💥', err);
        res.status(500).json({
            success: false,
            status: 'error',
            message: 'Something went wrong'
        });
    }
};

// Global error handling middleware
const errorMiddleware = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } else {
        let error = { ...err };
        error.message = err.message;

        // Handle MongoDB specific errors
        if (error.code === 11000) error = handleDuplicateKeyError(error);
        if (error.name === 'ValidationError') error = handleValidationError(error);
        if (error.name === 'CastError') error = handleCastErrorDB(error);

        sendErrorProd(error, res);
    }
};

// 404 handler for undefined routes
const notFoundMiddleware = (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
};

module.exports = {
    errorMiddleware,
    notFoundMiddleware
};