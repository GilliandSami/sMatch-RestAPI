const request = require('supertest');
const app = require('./setup');

let token;
let postId;

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

    // Crée un post pour les tests
    const postRes = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${token}`)
        .send({ content: 'This is a test post' });
    postId = postRes.body._id;
});

describe('Post Routes', () => {
    it('should retrieve posts with pagination', async () => {
        const res = await request(app)
            .get('/api/posts?page=1&limit=5')
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body.results)).toBe(true);
    });

    it('should delete a post', async () => {
        const res = await request(app)
            .delete(`/api/posts/${postId}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
    });
});
