const express = require('express');
const router = express.Router();
const {
    register,
    login,
    getMe,
    updateProfile,
    changePassword
} = require('../controllers/authController');

const { protect } = require('../middleware/auth');
const {
    registerValidation,
    loginValidation,
    updateProfileValidation,
    changePasswordValidation
} = require('../middleware/validators/authValidators');

// Ruta per registrar un nou usuari
router.post('/register', registerValidation, register);

// Ruta per iniciar sessió (Login)
router.post('/login', loginValidation, login);

// Ruta per obtenir les dades de l'usuari actual (requereix token aka 'protect')
router.get('/me', protect, getMe);

// Ruta per actualitzar el perfil de l'usuari
router.put('/profile', protect, updateProfileValidation, updateProfile);

// Ruta per canviar la contrasenya
router.put('/change-password', protect, changePasswordValidation, changePassword);

module.exports = router;
