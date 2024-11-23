const request = require('supertest');
const app = require('./setup');

let token;

beforeAll(async () => {
    const res = await request(app).post('/api/auth/login').send({
        email: 'test@example.com',
        password: 'password123',
    });
    token = res.body.token;
});

describe('Group Routes', () => {
    let groupId;

    it('should create a new group', async () => {
        const res = await request(app)
            .post('/api/groups')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Test Group',
                description: 'This is a test group',
            });
        expect(res.statusCode).toEqual(201);
        groupId = res.body._id;
    });
});
