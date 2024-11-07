const Post = require('../models/Post');

// Créer un post
exports.createPost = async (req, res) => {
    try {
        const post = new Post({ ...req.body, user: req.user.id });
        await post.save();
        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Récupérer des posts avec pagination
exports.getPosts = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    try {
        const posts = await Post.find().skip((page - 1) * limit).limit(parseInt(limit));
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Récupérer des posts avec pagination et filtres optionnels
exports.getFilteredPosts = async (req, res) => {
    const { page = 1, limit = 10, userId, keyword } = req.query;

    try {
        const query = {};

        // Filtre par utilisateur (si userId est fourni)
        if (userId) {
            query.user = userId;
        }

        // Filtre par mot-clé dans le contenu (si keyword est fourni)
        if (keyword) {
            query.content = { $regex: keyword, $options: 'i' }; // Recherche insensible à la casse
        }

        const posts = await Post.find(query)
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .populate('user', 'username'); // Peupler avec le nom de l'utilisateur

        const totalPosts = await Post.countDocuments(query); // Compter le nombre total de documents correspondant

        res.json({
            total: totalPosts,
            page: parseInt(page),
            limit: parseInt(limit),
            results: posts,
        });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Récupérer tous les posts d'un utilisateur spécifique
exports.getPostsByUser = async (req, res) => {
    try {
        const posts = await Post.find({ user: req.params.userId });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Mettre à jour un post (vérifier si l'utilisateur est l'auteur)
exports.updatePost = async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post non trouvé' });
    if (post.user.toString() !== req.user.id) return res.status(403).json({ message: 'Accès refusé' });
    try {
        Object.assign(post, req.body);
        await post.save();
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Supprimer un post
exports.deletePost = async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post non trouvé' });
    if (post.user.toString() !== req.user.id) return res.status(403).json({ message: 'Accès refusé' });
    try {
        await post.remove();
        res.json({ message: 'Post supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Liker un post
exports.likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post non trouvé' });
        if (!post.likes.includes(req.user.id)) {
            post.likes.push(req.user.id);
            await post.save();
        }
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Retirer le like d'un post
exports.unlikePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post non trouvé' });
        post.likes = post.likes.filter(userId => userId.toString() !== req.user.id);
        await post.save();
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};
