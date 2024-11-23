const request = require('supertest');
const app = require('./setup');

let token;
let postId;

beforeAll(async () => {
    const res = await request(app).post('/api/auth/login').send({
        email: 'test@example.com',
        password: 'password123',
    });
    token = res.body.token;
});

describe('Post Routes', () => {
    it('should create a new post', async () => {
        const res = await request(app)
            .post('/api/posts')
            .set('Authorization', `Bearer ${token}`)
            .send({
                content: 'This is a test post',
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('content', 'This is a test post');
        postId = res.body._id;
    });

    it('should retrieve posts with pagination', async () => {
        const res = await request(app)
            .get('/api/posts?page=1&limit=5')
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('results');
        expect(Array.isArray(res.body.results)).toBe(true);
    });

    it('should delete a post', async () => {
        const res = await request(app)
            .delete(`/api/posts/${postId}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
    });
});
