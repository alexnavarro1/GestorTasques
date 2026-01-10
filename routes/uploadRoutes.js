const express = require('express'); // Framework Express
const router = express.Router(); // Router d'Express
const multer = require('multer'); // Importar multer per accedir als tipus d'error
const uploadController = require('../controllers/uploadController'); // Controlador de pujades
const uploadLocal = require('../middleware/uploadLocal'); // Middleware pujada local
const uploadCloud = require('../middleware/uploadCloud'); // Middleware pujada Cloudinary

// Wrapper per gestionar errors de Multer i retornar JSON
const handleUpload = (middleware, singleParam) => {
    return (req, res, next) => {
        middleware.single(singleParam)(req, res, (err) => {
            if (err instanceof multer.MulterError) {
                // Error específic de Multer 
                return res.status(400).json({
                    success: false,
                    message: err.message,
                });
            } else if (err) {
                // Altres errors 
                return res.status(400).json({
                    success: false,
                    message: err.message,
                });
            }
            // Si no hi ha error, continuem
            next();
        });
    };
};

// Ruta per pujar imatges localment
router.post('/local', handleUpload(uploadLocal, 'image'), uploadController.uploadLocal);

// Ruta per pujar imatges a Cloudinary
router.post('/cloud', handleUpload(uploadCloud, 'image'), uploadController.uploadCloud);

module.exports = router;
