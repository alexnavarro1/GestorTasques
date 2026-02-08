const express = require('express'); // Framework Express
const router = express.Router(); // Router d'Express
const {
    createPermission,
    getAllPermissions,
    getPermissionsByCategory,
    getCategories,
    updatePermission,
    deletePermission
} = require('../controllers/permissionController'); // Controlador de permisos
const { protect } = require('../middleware/auth'); // Middleware protecció rutes
const checkPermission = require('../middleware/checkPermission'); // Middleware verificació permisos

router.use(protect); // Autenticació requerida per a totes les rutes

router.route('/')
    .post(checkPermission('permissions:manage'), createPermission)
    .get(checkPermission('permissions:read'), getAllPermissions);

router.get('/categories', checkPermission('permissions:read'), getCategories);
router.get('/by-category', checkPermission('permissions:read'), getPermissionsByCategory);

router.route('/:id')
    .put(checkPermission('permissions:manage'), updatePermission)
    .delete(checkPermission('permissions:manage'), deletePermission);

module.exports = router;
