const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../app');
const Group = require('../models/Group');
const User = require('../models/User');

describe('Group Routes', () => {
    let user;
    let token;

    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        user = await User.create({
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'password123',
        });

        token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });

    afterEach(async () => {
        await Group.deleteMany({});
    });

    it('should retrieve all groups', async () => {
        await Group.create({ name: 'Sample Group', created_by: user._id });

        const res = await request(app)
            .get('/api/groups')
            .set('Authorization', `Bearer ${token}`)
            .expect(200);

        expect(res.body).toBeInstanceOf(Array);
        expect(res.body.length).toBeGreaterThanOrEqual(1);
    });

    it('should add a member to a group', async () => {
        const group = await Group.create({
            name: 'Test Group',
            created_by: user._id,
        });

        const newUser = await User.create({
            username: 'memberuser',
            email: 'member@example.com',
            password: 'password123',
        });

        const res = await request(app)
            .post(`/api/groups/${group._id}/members`)
            .set('Authorization', `Bearer ${token}`)
            .send({ user: newUser._id })
            .expect(200);

        expect(res.body.members).toContainEqual(
            expect.objectContaining({
                user: newUser._id.toString(),
                role: 'member',
            })
        );
    });
});
