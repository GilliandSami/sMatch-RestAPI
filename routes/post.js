const express = require('express');
const protect = require('../middleware/auth');
const upload = require('../middleware/imageUpload');
const { createPost, getPosts, getPostsByUser, getFilteredPosts, updatePost, deletePost, likePost, unlikePost, getPostsNearby } = require('../controllers/postController');
const { validatePostCreation } = require('../validators/postValidator');
const router = express.Router();

// Créer un post (utilisateur authentifié requis)
router.post('/', protect, upload.single('media_uri'), validatePostCreation, createPost);

// Récupérer une liste de posts avec pagination
router.get('/', protect, getPosts);

// Récupérer une liste de posts avec pagination et filtres
router.get('/paginate', protect, getFilteredPosts);

// Récupérer tous les posts d'un utilisateur spécifique
router.get('/user/:userId', protect, getPostsByUser);

// Récupérer les posts proches d'une position géographique
router.get('/nearby', protect, getPostsNearby);

// Mettre à jour un post (seulement pour l'auteur)
router.patch('/:id', protect, updatePost);

// Supprimer un post (seulement pour l'auteur)
router.delete('/:id', protect, deletePost);

// Liker un post
router.post('/:id/like', protect, likePost);

// Retirer le like d'un post
router.delete('/:id/like', protect, unlikePost);

module.exports = router;
