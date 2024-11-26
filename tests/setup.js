const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('../app');

dotenv.config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' });

console.log(`Using environment: ${process.env.NODE_ENV}`);
console.log(`Using database: ${process.env.MONGO_URI}`);

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

afterEach(async () => {
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
        await collection.deleteMany({});
    }
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    console.log('Database cleared and connection closed.');
});

module.exports = app;
