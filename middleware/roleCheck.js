// Middleware per verificar rols
const roleCheck = (roles) => {
    return (req, res, next) => {
        // Si no hi ha usuari (no ha passat per auth), error
        if (!req.user) {
             return res.status(401).json({
                 success: false,
                 error: 'Usuari no autenticat'
             });
        }

        // Si el rol de l'usuari no està inclòs en els rols permesos
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                error: 'No tens permisos per accedir a aquest recurs' // Missatge exacte demanat
            });
        }

        next();
    };
};

module.exports = roleCheck;
