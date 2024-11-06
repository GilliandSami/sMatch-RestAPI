const { body, validationResult } = require('express-validator');

exports.validateGroupCreation = [
    body('name').notEmpty().withMessage('Le nom du groupe est requis'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];
