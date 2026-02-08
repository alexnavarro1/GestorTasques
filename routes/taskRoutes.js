const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { protect } = require('../middleware/auth');
const checkPermission = require('../middleware/checkPermission');
const { createTaskValidation, updateTaskValidation } = require('../middleware/validators/taskValidators');
const { validationResult } = require('express-validator');

// Middleware per comprovar errors de validació
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
};

router.use(protect); // A partir d'aquí, totes les rutes requereixen estar autenticat

// Ruta per obtenir estadístiques personals
router.get('/stats', checkPermission('tasks:read'), taskController.getTaskStats);

// Ruta per crear un nou registre amb validació
router.post('/', checkPermission('tasks:create'), createTaskValidation, validate, taskController.createTask);

// Ruta per llistar tots els registres propis
router.get('/', checkPermission('tasks:read'), taskController.getAllTasks);

// Ruta per obtenir detalls d'un registre específic
router.get('/:id', checkPermission('tasks:read'), taskController.getTaskById);

// Ruta per actualitzar un registre existent (amb validació)
router.put('/:id', checkPermission('tasks:update'), updateTaskValidation, validate, taskController.updateTask);

// Ruta per eliminar un registre
router.delete('/:id', checkPermission('tasks:delete'), taskController.deleteTask);

// Rutes per gestionar la imatge associada
router.put('/:id/image', checkPermission('tasks:update'), taskController.updateTaskImage);
router.put('/:id/image/reset', checkPermission('tasks:update'), taskController.resetTaskImage);

module.exports = router;