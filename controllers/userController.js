const User = require('../models/User');
const Post = require('../models/Post');

// Récupérer tous les utilisateurs
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Récupérer un utilisateur par son ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Mettre à jour un utilisateur (seulement pour l'utilisateur connecté)
exports.updateUser = async (req, res) => {
    if (req.user.id !== req.params.id) {
        return res.status(403).json({ message: 'Accès refusé' });
    }
    try {
        const updateData = { ...req.body };

        if (req.file) {
            updateData.profile_picture = req.file.path;
        }

        const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true, });

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Supprimer un utilisateur (seulement pour l'utilisateur connecté)
exports.deleteUser = async (req, res) => {
    if (req.user.id !== req.params.id) {
        return res.status(403).json({ message: 'Accès refusé' });
    }
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'Utilisateur supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Suivre un utilisateur
exports.followUser = async (req, res) => {
    try {
        const userToFollow = await User.findById(req.params.id);
        const currentUser = await User.findById(req.user.id);

        if (!userToFollow) return res.status(404).json({ message: 'Utilisateur non trouvé' });

        if (!currentUser.following.includes(userToFollow.id)) {
            currentUser.following.push(userToFollow.id);
            userToFollow.followers.push(currentUser.id);
            await currentUser.save();
            await userToFollow.save();
        }

        res.json({ message: `Vous suivez maintenant ${userToFollow.username}` });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};


// Ne plus suivre un utilisateur
exports.unfollowUser = async (req, res) => {
    try {
        const userToUnfollow = await User.findById(req.params.id);
        const currentUser = await User.findById(req.user.id);

        if (!userToUnfollow) return res.status(404).json({ message: 'Utilisateur non trouvé' });

        currentUser.following = currentUser.following.filter(userId => userId.toString() !== userToUnfollow.id);
        userToUnfollow.followers = userToUnfollow.followers.filter(userId => userId.toString() !== currentUser.id);

        await currentUser.save();
        await userToUnfollow.save();

        res.json({ message: `Vous ne suivez plus ${userToUnfollow.username}` });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Obtenir les statistiques d'un utilisateur
exports.getUserStats = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

        // Compter le nombre de posts de l'utilisateur
        const postCount = await Post.countDocuments({ user: user._id });

        // Compter le nombre de followers de l'utilisateur
        const followerCount = user.followers.length;

        res.json({
            username: user.username,
            postCount,
            followerCount,
        });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};
