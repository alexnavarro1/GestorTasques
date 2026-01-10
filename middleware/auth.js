const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware per protegir rutes
exports.protect = async (req, res, next) => {
    let token;

    // 1. Comprovem si el token ve al header Authorization
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        // Obtenim el token (Bearer <token>)
        token = req.headers.authorization.split(' ')[1];
    }

    // 2. Si no hi ha token, retornem error
    if (!token) {
        return res.status(401).json({
            success: false,
            error: 'No autoritzat. Token no proporcionat' // Missatge exacte demanat
        });
    }

    try {
        // 3. Verifiquem el token verificant la firma
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 4. Busquem l'usuari a la BD
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'No s\'ha trobat l\'usuari associat al token'
            });
        }

        // 5. Guardem l'usuari a la request per usar-lo després
        req.user = user;
        next();

    } catch (err) {
        return res.status(401).json({
            success: false,
            error: 'Token invàlid o expirat' // Missatge exacte demanat
        });
    }
};
