const { body } = require('express-validator');

// Validacions per a la creació de tasques
exports.createTaskValidation = [
    body('title')
        .notEmpty().withMessage('El títol és obligatori')
        .trim(),
    body('cost')
        .notEmpty().withMessage('El cost és obligatori')
        .isNumeric().withMessage('El cost ha de ser un número')
        .isFloat({ min: 0 }).withMessage('El cost no pot ser negatiu'),
    body('hours_estimated')
        .notEmpty().withMessage('La previsió d\'hores és obligatòria')
        .isNumeric().withMessage('Les hores estimades han de ser un número')
        .isFloat({ min: 0 }).withMessage('Les hores no poden ser negatives'),
    body('description')
        .optional()
        .trim()
];

// Validacions per a l'actualització de tasques
exports.updateTaskValidation = [
    body('title')
        .optional()
        .notEmpty().withMessage('El títol no pot estar buit')
        .trim(),
    body('cost')
        .optional()
        .isNumeric().withMessage('El cost ha de ser un número')
        .isFloat({ min: 0 }).withMessage('El cost no pot ser negatiu'),
    body('hours_estimated')
        .optional()
        .isNumeric().withMessage('Les hores estimades han de ser un número')
        .isFloat({ min: 0 }).withMessage('Les hores no poden ser negatives'),
    body('description')
        .optional()
        .trim(),
    body('completed')
        .optional()
        .isBoolean().withMessage('Completed ha de ser true o false')
];
