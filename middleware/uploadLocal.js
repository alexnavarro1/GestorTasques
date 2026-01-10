const multer = require('multer'); // Middleware per gestionar fitxers
const path = require('path'); // Gestió de rutes
const fs = require('fs'); // Sistema de fitxers


// Comprovem si el directori existeix, si no, el creem recursivament
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuració d'emmagatzematge local
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Directori de destí
    },
    filename: (req, file, cb) => {
        // Generem un nom únic concatenant el timestamp actual i el nom original
        const uniqueName = Date.now() + '-' + file.originalname;
        cb(null, uniqueName);
    }
});

// Filtrar només imatges
const fileFilter = (req, file, cb) => {
    // Comprovem el tipus MIME de l'arxiu
    if (file.mimetype.startsWith('image/')) {
        cb(null, true); // Acceptem l'arxiu
    } else {
        cb(new Error("Només es permeten arxius d'imatge"), false); // Rebutgem l'arxiu
    }
};

// Configuració de Multer per pujada local
const uploadLocal = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // Límit de 5MB
    },
    fileFilter: fileFilter
});

module.exports = uploadLocal;
