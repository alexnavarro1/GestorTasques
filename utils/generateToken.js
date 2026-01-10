const jwt = require('jsonwebtoken');

// Funció per generar un token JWT per a l'autenticació
const generateToken = (id, email, role) => {
    // Es signa el token amb l'ID, email i rol de l'usuari
    return jwt.sign({ userId: id, email, role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

module.exports = generateToken;
