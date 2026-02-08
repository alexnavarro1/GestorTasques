const express = require('express');
const router = express.Router();
const {
    getAllUsers,
    getAllTasks,
    deleteUser,
    changeUserRole,
    assignRoleToUser,
    removeRoleFromUser,
    getUserPermissions
} = require('../controllers/adminController');

const { protect } = require('../middleware/auth');
const checkPermission = require('../middleware/checkPermission');

// Totes les rutes requereixen auth
router.use(protect);

router.get('/users', checkPermission('users:manage'), getAllUsers); // O users:read
router.get('/tasks', checkPermission('tasks:read'), getAllTasks); // Tasques globals
router.delete('/users/:id', checkPermission('users:manage'), deleteUser);
router.put('/users/:id/role', checkPermission('users:manage'), changeUserRole); // Deprecated/Legacy method

// Nous endpoints de gestió de rols d'usuari
router.post('/users/:userId/roles', checkPermission('users:manage'), assignRoleToUser);
router.delete('/users/:userId/roles/:roleId', checkPermission('users:manage'), removeRoleFromUser);
router.get('/users/:userId/permissions', checkPermission('users:read'), getUserPermissions);

module.exports = router;
