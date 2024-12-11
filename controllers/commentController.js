const Comment = require('../models/Comment');

// Créer un commentaire
exports.createComment = async (req, res) => {
    try {
        const comment = new Comment({
            content: req.body.content,
            post: req.body.post,
            user: req.user.id,
            media_uri: req.file ? req.file.path : null // URL de l'image sur Cloudinary
        });
        await comment.save();
        res.status(201).json(comment);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Récupérer les commentaires d'un post avec pagination
exports.getCommentsByPost = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    try {
        const comments = await Comment.find({ post: req.params.postId })
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .populate('user', 'username');
        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Récupérer les commentaires d'un post spécifique avec pagination et filtre optionnel par mot-clé
exports.getFilteredCommentsByPost = async (req, res) => {
    const { page = 1, limit = 10, keyword } = req.query;

    try {
        const query = { post: req.params.postId };

        // Filtre par mot-clé dans le contenu (si keyword est fourni)
        if (keyword) {
            query.content = { $regex: keyword, $options: 'i' }; // Recherche insensible à la casse
        }

        const comments = await Comment.find(query)
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .populate('user', 'username'); // Peupler avec le nom de l'utilisateur

        const totalComments = await Comment.countDocuments(query); // Compter le nombre total de documents correspondant

        res.json({
            total: totalComments,
            page: parseInt(page),
            limit: parseInt(limit),
            results: comments,
        });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Récupérer tous les commentaires d'un utilisateur spécifique
exports.getCommentsByUser = async (req, res) => {
    try {
        const comments = await Comment.find({ user: req.params.userId });
        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Mettre à jour un commentaire (vérifier si l'utilisateur est l'auteur)
exports.updateComment = async (req, res) => {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Commentaire non trouvé' });
    if (comment.user.toString() !== req.user.id) return res.status(403).json({ message: 'Accès refusé' });
    try {
        Object.assign(comment, req.body);
        await comment.save();
        res.json(comment);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Supprimer un commentaire
exports.deleteComment = async (req, res) => {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Commentaire non trouvé' });
    if (comment.user.toString() !== req.user.id) return res.status(403).json({ message: 'Accès refusé' });
    try {
        await comment.deleteOne();
        res.json({ message: 'Commentaire supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Liker un commentaire
exports.likeComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) return res.status(404).json({ message: 'Commentaire non trouvé' });
        if (!comment.likes.includes(req.user.id)) {
            comment.likes.push(req.user.id);
            await comment.save();
        }
        res.json(comment);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Retirer le like d'un commentaire
exports.unlikeComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) return res.status(404).json({ message: 'Commentaire non trouvé' });
        comment.likes = comment.likes.filter(userId => userId.toString() !== req.user.id);
        await comment.save();
        res.json(comment);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};
