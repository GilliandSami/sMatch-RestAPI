const request = require('supertest');
const app = require('./setup');

describe('Auth Routes', () => {
    it('should register a new user', async () => {
        const res = await request(app).post('/api/auth/register').send({
            username: 'testuser',
            email: 'test@example.com',
            password: 'password123',
        });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('token');
    });

    it('should not register a user with an existing email', async () => {
        await request(app).post('/api/auth/register').send({
            username: 'testuser2',
            email: 'test@example.com',
            password: 'password123',
        });
        const res = await request(app).post('/api/auth/register').send({
            username: 'testuser3',
            email: 'test@example.com',
            password: 'password123',
        });
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('message');
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
