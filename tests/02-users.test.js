const request = require('supertest');
const app = require('./setup');

describe('Auth Routes', () => {
    beforeAll(async () => {
        // Crée un utilisateur avant les tests
        await request(app).post('/api/auth/register').send({
            username: 'testuser',
            email: 'test@example.com',
            password: 'password123',
        });
    });

    it('should register a new user', async () => {
        const res = await request(app).post('/api/auth/register').send({
            username: 'newuser',
            email: 'newuser@example.com',
            password: 'password123',
        });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('token');
    });

    it('should authenticate an existing user', async () => {
        const res = await request(app).post('/api/auth/login').send({
            email: 'test@example.com',
            password: 'password123',
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
    });
});
