const express = require('express');
const router = express.Router();
const {
    getAllUsers,
    getAllTasks,
    deleteUser,
    changeUserRole
} = require('../controllers/adminController');

const { protect } = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// Totes les rutes requereixen auth i ser admin
router.use(protect);
router.use(roleCheck(['admin']));

router.get('/users', getAllUsers);
router.get('/tasks', getAllTasks);
router.delete('/users/:id', deleteUser);
router.put('/users/:id/role', changeUserRole);

module.exports = router;
