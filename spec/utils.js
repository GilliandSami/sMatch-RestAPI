const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const connectToDatabase = async () => {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    }
};

const disconnectDatabase = async () => {
    await mongoose.disconnect();
};

const cleanUpDatabase = async () => {
    const collections = await mongoose.connection.db.collections();
    for (const collection of collections) {
        await collection.deleteMany({});
    }
};

const generateValidJwt = (user) => {
    const payload = { id: user._id };
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};

module.exports = {
    connectToDatabase,
    disconnectDatabase,
    cleanUpDatabase,
    generateValidJwt,
};
