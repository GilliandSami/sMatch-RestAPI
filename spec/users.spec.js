const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../app');
const { connectToDatabase, cleanUpDatabase, disconnectDatabase } = require('./utils');

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

afterEach(async () => {
    await cleanUpDatabase();
});

afterAll(async () => {
    await disconnectDatabase();
});

describe('User Routes', () => {
    it('should register a new user', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                username: 'newuser',
                email: 'newuser@example.com',
                password: 'password123',
            })
            .expect(201);

        expect(res.body).toHaveProperty('token');
    });

    it('should retrieve all users', async () => {
        // Create a user for testing
        await request(app)
            .post('/api/auth/register')
            .send({
                username: 'testuser',
                email: 'testuser@example.com',
                password: 'password123',
            });

        const tokenResponse = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'testuser@example.com',
                password: 'password123',
            });

        const token = tokenResponse.body.token;

        const res = await request(app)
            .get('/api/users')
            .set('Authorization', `Bearer ${token}`)
            .expect(200);

        expect(res.body).toBeInstanceOf(Array);
        expect(res.body.length).toBeGreaterThanOrEqual(1);
    });
});
