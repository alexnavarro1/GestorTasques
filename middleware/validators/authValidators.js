const { body } = require('express-validator');

// Validacions per al registre d'usuaris
exports.registerValidation = [
    body('name')
        .optional()
        .isLength({ min: 2 }).withMessage('El nom ha de tenir com a mínim 2 caràcters'),
    body('email')
        .isEmail().withMessage('Email no vàlid'), // Missatge exacte demanat
    body('password')
        .isLength({ min: 6 }).withMessage('La contrasenya ha de tenir mínim 6 caràcters') // Missatge exacte demanat
];

// Validacions per a l'inici de sessió
exports.loginValidation = [
    body('email')
        .isEmail().withMessage('Si us plau, introdueix un email vàlid')
        .notEmpty().withMessage('El correu electrònic és obligatori'),
    body('password')
        .notEmpty().withMessage('La contrasenya és obligatòria')
];

// Validacions per a l'actualització de perfil
exports.updateProfileValidation = [
    body('name')
        .optional()
        .isLength({ min: 2 }).withMessage('El nom ha de tenir com a mínim 2 caràcters'),
    body('email')
        .optional()
        .isEmail().withMessage('Si us plau, introdueix un email vàlid')
];

// Validacions per al canvi de contrasenya
exports.changePasswordValidation = [
    body('currentPassword')
        .notEmpty().withMessage('La contrasenya actual és obligatòria'),
    body('newPassword')
        .isLength({ min: 6 }).withMessage('La nova contrasenya ha de tenir com a mínim 6 caràcters')
];
