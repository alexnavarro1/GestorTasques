const multer = require('multer'); // Middleware per gestionar la pujada de fitxers
const { CloudinaryStorage } = require('multer-storage-cloudinary'); // Emmagatzematge per Cloudinary
const cloudinary = require('../config/cloudinary'); // Configuració de Cloudinary

// Configuració de l'emmagatzematge de Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'task-manager/images', // Carpeta a Cloudinary
        allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'webp'], // Formats permesos
    },
});

// Creació del middleware multer amb la configuració de Cloudinary
const uploadCloud = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // Límit de 5MB
});

module.exports = uploadCloud;
