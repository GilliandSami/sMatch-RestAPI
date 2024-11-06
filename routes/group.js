const express = require('express');
const protect = require('../middleware/auth');
const { createGroup, getGroups, updateGroup, deleteGroup, addMember, removeMember } = require('../controllers/groupController');
const { validateGroupCreation } = require('../validators/groupValidator');
const router = express.Router();

// Créer un groupe (utilisateur authentifié requis)
router.post('/', protect, validateGroupCreation, createGroup);

// Récupérer les groupes avec possibilité de filtre
router.get('/', protect, getGroups);

// Mettre à jour un groupe (seulement pour l'admin)
router.patch('/:id', protect, updateGroup);

// Supprimer un groupe (seulement pour l'admin)
router.delete('/:id', protect, deleteGroup);

// Ajouter un membre à un groupe
router.post('/:id/members', protect, addMember);

// Supprimer un membre d'un groupe
router.delete('/:id/members/:userId', protect, removeMember);

module.exports = router;