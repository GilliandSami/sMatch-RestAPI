const { body, validationResult } = require('express-validator');

exports.validateUserUpdate = [
    body('username').optional().notEmpty().withMessage('Le nom d\'utilisateur ne peut pas être vide'),
    body('email').optional().isEmail().withMessage('Email invalide'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];