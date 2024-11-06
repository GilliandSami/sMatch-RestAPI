const express = require('express');
const authRoutes = require('./auth');
const userRoutes = require('./user');
const postRoutes = require('./post');
const commentRoutes = require('./comment');
const groupRoutes = require('./group');

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Bienvenue sur l\'API sMatch !');
});

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/comments', commentRoutes);
router.use('/groups', groupRoutes);

module.exports = router;