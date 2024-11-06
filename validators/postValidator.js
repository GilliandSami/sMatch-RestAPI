const { body, validationResult } = require('express-validator');

exports.validatePostCreation = [
    body('content').notEmpty().withMessage('Le contenu ne peut pas être vide'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];
