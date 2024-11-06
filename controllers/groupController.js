const Group = require('../models/Group');

// Créer un groupe
exports.createGroup = async (req, res) => {
    try {
        const group = new Group({ ...req.body, created_by: req.user.id });
        await group.save();
        res.status(201).json(group);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Récupérer les groupes avec filtre optionnel
exports.getGroups = async (req, res) => {
    try {
        const groups = await Group.find(req.query);
        res.json(groups);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Mettre à jour un groupe (seulement pour l'admin)
exports.updateGroup = async (req, res) => {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: 'Groupe non trouvé' });
    if (group.created_by.toString() !== req.user.id) return res.status(403).json({ message: 'Accès refusé' });
    try {
        Object.assign(group, req.body);
        await group.save();
        res.json(group);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Supprimer un groupe
exports.deleteGroup = async (req, res) => {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: 'Groupe non trouvé' });
    if (group.created_by.toString() !== req.user.id) return res.status(403).json({ message: 'Accès refusé' });
    try {
        await group.remove();
        res.json({ message: 'Groupe supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Ajouter un membre
exports.addMember = async (req, res) => {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: 'Groupe non trouvé' });
    try {
        group.members.push({ user: req.body.user, role: 'member' });
        await group.save();
        res.json(group);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Supprimer un membre
exports.removeMember = async (req, res) => {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: 'Groupe non trouvé' });
    try {
        group.members = group.members.filter(member => member.user.toString() !== req.params.userId);
        await group.save();
        res.json(group);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};
