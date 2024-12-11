const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const request = require('supertest');
const app = require('../app');
const Post = require('../models/Post');
const User = require('../models/User');

describe('Post Routes', () => {
    let user, token;

    beforeAll(async () => {
        // Connect to test database
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        // Create a test user
        user = await User.create({
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'password123',
        });

        // Generate a valid JWT token for the user
        token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    });

    afterAll(async () => {
        // Cleanup database and close connection
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });

    afterEach(async () => {
        // Cleanup collections between tests
        await Post.deleteMany({});
    });

    it('should create a new post', async () => {
        const res = await request(app)
            .post('/api/posts')
            .set('Authorization', `Bearer ${token}`)
            .send({
                content: 'This is a test post',
            })
            .expect(201);

        expect(res.body).toHaveProperty('content', 'This is a test post');
        expect(res.body).toHaveProperty('user', user._id.toString());
    });

    it('should retrieve all posts', async () => {
        // Add a post to the database
        await Post.create({
            content: 'Post for testing',
            user: user._id,
        });

        const res = await request(app)
            .get('/api/posts')
            .set('Authorization', `Bearer ${token}`)
            .expect(200);

        expect(res.body).toBeInstanceOf(Array);
        expect(res.body.length).toBeGreaterThanOrEqual(1);
        expect(res.body[0]).toHaveProperty('content', 'Post for testing');
    });

    it('should like a post', async () => {
        const post = await Post.create({
            content: 'This post will be liked',
            user: user._id,
        });

        const res = await request(app)
            .post(`/api/posts/${post._id}/like`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200);

        expect(res.body).toHaveProperty('likes');
        expect(res.body.likes).toContain(user._id.toString());
    });
});
