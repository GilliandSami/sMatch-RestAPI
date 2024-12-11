const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const request = require('supertest');
const app = require('../app');
const Comment = require('../models/Comment');
const User = require('../models/User');
const Post = require('../models/Post');

describe('Comment Routes', () => {
    let user, token, post;

    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        user = await User.create({
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'password123',
        });

        token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        post = await Post.create({
            content: 'This is a test post',
            user: user._id,
        });
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });

    afterEach(async () => {
        await Comment.deleteMany({});
    });

    it('should create a new comment', async () => {
        const res = await request(app)
            .post('/api/comments')
            .set('Authorization', `Bearer ${token}`)
            .send({
                content: 'This is a test comment',
                post: post._id,
            })
            .expect(201);

        expect(res.body).toHaveProperty('content', 'This is a test comment');
        expect(res.body).toHaveProperty('post', post._id.toString());
        expect(res.body).toHaveProperty('user', user._id.toString());
    });

    it('should retrieve all comments for a post', async () => {
        await Comment.create({
            content: 'Comment for testing',
            post: post._id,
            user: user._id,
        });

        const res = await request(app)
            .get(`/api/comments/${post._id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200);

        expect(res.body).toBeInstanceOf(Array);
        expect(res.body.length).toBeGreaterThanOrEqual(1);
        expect(res.body[0]).toHaveProperty('content', 'Comment for testing');
    });
});
