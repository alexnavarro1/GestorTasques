const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { protect } = require('../middleware/auth');
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

// Obtenir estadístiques de les tasques de l'usuari
router.get('/stats', taskController.getTaskStats);

// Crear una nova tasca (amb validació de dades)
router.post('/', createTaskValidation, validate, taskController.createTask);

// Obtenir totes les tasques de l'usuari
router.get('/', taskController.getAllTasks);

// Obtenir una tasca específica per ID
router.get('/:id', taskController.getTaskById);

// Actualitzar una tasca (amb validació)
router.put('/:id', updateTaskValidation, validate, taskController.updateTask);

// Eliminar una tasca
router.delete('/:id', taskController.deleteTask);

// Rutes per gestionar la imatge de la tasca
router.put('/:id/image', taskController.updateTaskImage);
router.put('/:id/image/reset', taskController.resetTaskImage);

module.exports = router;