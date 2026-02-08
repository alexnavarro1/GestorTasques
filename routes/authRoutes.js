const express = require('express'); // Framework Express
const router = express.Router(); // Router d'Express
const {
    register,
    login,
    getMe,
    updateProfile,
    changePassword,
    checkPermissionEndpoint
} = require('../controllers/authController'); // Controlador d'autenticació

const { protect } = require('../middleware/auth'); // Middleware protecció rutes
const {
    registerValidation,
    loginValidation,
    updateProfileValidation,
    changePasswordValidation
} = require('../middleware/validators/authValidators'); // Validacions d'autenticació

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

// Ruta per verificar permisos
router.post('/check-permission', protect, checkPermissionEndpoint);

module.exports = router;
