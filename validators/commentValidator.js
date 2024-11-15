const { body, validationResult } = require('express-validator');

exports.validateCommentCreation = [
    body('content').notEmpty().withMessage('Le contenu ne peut pas être vide'),
    body('post').notEmpty().withMessage('Le post associé est requis'),
    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        next();
    }
];
