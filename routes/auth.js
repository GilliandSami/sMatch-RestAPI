const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const router = express.Router();

router.post(
    '/register',
    [
        body('username').notEmpty().withMessage('Le nom d\'utilisateur est requis'),
        body('email').isEmail().withMessage('Email invalide'),
        body('password').isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, email, password } = req.body;

        try {
            let user = await User.findOne({ email });
            if (user) {
                return res.status(400).json({ message: 'L\'utilisateur existe déjà' });
            }

            user = new User({ username, email, password });
            await user.save();

            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.status(201).json({ token });
        } catch (error) {
            res.status(500).json({ message: 'Erreur de serveur' });
        }
    }
);

router.post(
    '/login',
    [
        body('email').isEmail().withMessage('Email invalide'),
        body('password').exists().withMessage('Le mot de passe est requis')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        try {
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ message: 'Identifiants incorrects' });
            }

            const isMatch = await user.matchPassword(password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Identifiants incorrects' });
            }

            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.status(200).json({ token });
        } catch (error) {
            res.status(500).json({ message: 'Erreur de serveur' });
        }
    }
);

module.exports = router;