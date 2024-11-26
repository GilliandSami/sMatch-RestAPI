const request = require('supertest');
const app = require('./setup');

let token;
let groupId;

beforeAll(async () => {
    // Enregistre un utilisateur et récupère le token
    await request(app).post('/api/auth/register').send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
    });

    const loginRes = await request(app).post('/api/auth/login').send({
        email: 'test@example.com',
        password: 'password123',
    });
    token = loginRes.body.token;
});

describe('Group Routes', () => {
    it('should create a new group', async () => {
        const res = await request(app)
            .post('/api/groups')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Test Group', description: 'This is a test group' });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('name', 'Test Group');
        groupId = res.body._id;
    });

    it('should retrieve all groups', async () => {
        const res = await request(app)
            .get('/api/groups')
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('should delete a group', async () => {
        const res = await request(app)
            .delete(`/api/groups/${groupId}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
    });
});
