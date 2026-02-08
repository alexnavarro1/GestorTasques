const AuditLog = require('../models/AuditLog');

const checkPermission = (permission) => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    error: 'Usuari no autenticat'
                });
            }

            // Verificar si l'usuari té el permís
            // Utilitzem el mètode que hem afegit al model User
            const hasPermission = await req.user.hasPermission(permission);

            // Guardem el permís requerit a la request per a l'auditoria (opcional o útil)
            req.requiredPermission = permission;

            if (!hasPermission) {
                // El middleware d'auditoria (auditMiddleware) capturarà automàticament aquesta resposta 403
                // gràcies a que hem establert req.requiredPermission
                
                return res.status(403).json({
                    success: false,
                    error: 'No tens permís per fer aquesta acció',
                    permission: permission
                });
            }

            next();
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                error: 'Error al verificar els permisos'
            });
        }
    };
};

module.exports = checkPermission;
