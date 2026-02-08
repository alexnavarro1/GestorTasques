const ErrorResponse = require('../utils/errorResponse'); // Utilitat de resposta d'error

const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // Log per a la consola (per desenvolupament)
    console.log(err);

    // Error de Cast de Mongoose (ID invàlid)
    if (err.name === 'CastError') {
        const message = `Recurs no trobat amb id: ${err.value}`;
        error = new ErrorResponse(message, 404);
    }

    // Error de clau duplicada de Mongoose (Codi 11000)
    if (err.code === 11000) {
        const message = 'Valor duplicat introduït';
        error = new ErrorResponse(message, 400);
    }

    // Error de validació de Mongoose
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
