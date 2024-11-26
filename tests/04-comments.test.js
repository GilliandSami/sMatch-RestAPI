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

    // Crée un post pour y ajouter des commentaires
    const postRes = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${token}`)
        .send({ content: 'This is a test post' });
    postId = postRes.body._id;
});

describe('Comment Routes', () => {
    it('should create a comment on a post', async () => {
        const res = await request(app)
            .post('/api/comments')
            .set('Authorization', `Bearer ${token}`)
            .send({ content: 'This is a test comment', post: postId });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('content', 'This is a test comment');
    });

    it('should retrieve comments for a post', async () => {
        const res = await request(app)
            .get(`/api/comments/${postId}?page=1&limit=5`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body.results)).toBe(true);
    });
});
