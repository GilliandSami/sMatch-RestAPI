const express = require('express');
const protect = require('../middleware/auth');
const { getAllUsers, getUserById, updateUser, deleteUser, followUser, unfollowUser, getUserStats } = require('../controllers/userController');
const { validateUserUpdate } = require('../validators/userValidator');
const router = express.Router();

// Récupérer tous les utilisateurs
router.get('/', protect, getAllUsers);

// Récupérer un utilisateur par ID
router.get('/:id', protect, getUserById);

// Mettre à jour les informations d'un utilisateur (seulement pour l'utilisateur connecté)
router.patch('/:id', protect, validateUserUpdate, updateUser);

// Supprimer un utilisateur (seulement pour l'utilisateur connecté)
router.delete('/:id', protect, deleteUser);

// Suivre un utilisateur
router.post('/:id/follow', protect, followUser);

// Ne plus suivre un utilisateur
router.delete('/:id/follow', protect, unfollowUser);

// Obtenir les statistiques d'un utilisateur
router.get('/:id/stats', protect, getUserStats);

module.exports = router;
