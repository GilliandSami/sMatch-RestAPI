const request = require('supertest');
const app = require('./setup');

let token;
let postId;

beforeAll(async () => {
    const loginRes = await request(app).post('/api/auth/login').send({
        email: 'test@example.com',
        password: 'password123',
    });
    token = loginRes.body.token;

    const postRes = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${token}`)
        .send({
            content: 'Post for comments testing',
        });
    postId = postRes.body._id;
});

describe('Comment Routes', () => {
    let commentId;

    it('should create a comment on a post', async () => {
        const res = await request(app)
            .post('/api/comments')
            .set('Authorization', `Bearer ${token}`)
            .send({
                content: 'This is a comment',
                post: postId,
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('content', 'This is a comment');
        commentId = res.body._id;
    });
});
