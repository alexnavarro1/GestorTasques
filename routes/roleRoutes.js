const express = require('express'); // Framework Express
const router = express.Router(); // Router d'Express
const {
    createRole,
    getAllRoles,
    getRoleById,
    updateRole,
    deleteRole,
    addPermissionToRole,
    removePermissionFromRole
} = require('../controllers/roleController'); // Controlador de rols
const { protect } = require('../middleware/auth'); // Middleware protecció rutes
const checkPermission = require('../middleware/checkPermission'); // Middleware verificació permisos

router.use(protect);

router.route('/')
    .post(checkPermission('roles:manage'), createRole)
    .get(checkPermission('roles:read'), getAllRoles);

router.route('/:id')
    .get(checkPermission('roles:read'), getRoleById)
    .put(checkPermission('roles:manage'), updateRole)
    .delete(checkPermission('roles:manage'), deleteRole);

router.post('/:id/permissions', checkPermission('roles:manage'), addPermissionToRole);
router.delete('/:id/permissions/:permissionId', checkPermission('roles:manage'), removePermissionFromRole);

module.exports = router;
