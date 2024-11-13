const express = require('express');
const protect = require('../middleware/auth');
const upload = require('../middleware/imageUpload');
const { createComment, getCommentsByPost, getCommentsByUser, getFilteredCommentsByPost, updateComment, deleteComment, likeComment, unlikeComment } = require('../controllers/commentController');
const { validateCommentCreation } = require('../validators/commentValidator');
const router = express.Router();

// Créer un commentaire (utilisateur authentifié requis)
router.post('/', protect, upload.single('media_uri'), validateCommentCreation, createComment);

// Récupérer les commentaires d'un message spécifique avec pagination
router.get('/:postId', protect, getCommentsByPost);

// Récupérer les commentaires d'un message spécifique avec pagination et filtres
router.get('/paginate/:postId', protect, getFilteredCommentsByPost);

// Récupérer tous les commentaires d'un utilisateur spécifique
router.get('/user/:userId', protect, getCommentsByUser);

// Mettre à jour un commentaire (seulement pour l'auteur)
router.patch('/:id', protect, updateComment);

// Supprimer un commentaire (seulement pour l'auteur)
router.delete('/:id', protect, deleteComment);

// Liker un commentaire
router.post('/:id/like', protect, likeComment);

// Retirer le like d'un commentaire
router.delete('/:id/like', protect, unlikeComment);

module.exports = router;
