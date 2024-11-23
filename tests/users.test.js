const request = require('supertest');
const app = require('./setup');

let token;
let userId;

beforeAll(async () => {
    const res = await request(app).post('/api/auth/login').send({
        email: 'test@example.com',
        password: 'password123',
    });
    token = res.body.token;
});

describe('User Routes', () => {
    it('should retrieve all users', async () => {
        const res = await request(app)
            .get('/api/users')
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBe(true);
        userId = res.body[0]?._id;
        expect(userId).toBeTruthy();
    });

    it('should retrieve a user by ID', async () => {
        const res = await request(app)
            .get(`/api/users/${userId}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('_id', userId);
    });

    it('should update user information', async () => {
        const res = await request(app)
            .patch(`/api/users/${userId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ bio: 'Updated bio' });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('bio', 'Updated bio');
    });
});
