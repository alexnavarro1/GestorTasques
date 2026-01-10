const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // Log per a la consola (per desenvolupament)
    console.log(err);

    // Mongoose bad ObjectId (CastError)
    if (err.name === 'CastError') {
        const message = `Recurs no trobat amb id: ${err.value}`;
        error = new ErrorResponse(message, 404);
    }

    // Mongoose duplicate key (Codi 11000)
    if (err.code === 11000) {
        const message = 'Valor duplicat introduït';
        error = new ErrorResponse(message, 400);
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message);
        error = new ErrorResponse(message, 400);
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Error del Servidor'
    });
};

module.exports = errorHandler;
