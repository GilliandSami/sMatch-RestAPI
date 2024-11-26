const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.test' });

const clearDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        const collections = await mongoose.connection.db.collections();
        for (let collection of collections) {
            await collection.deleteMany({});
        }

        console.log('Database cleared successfully.');
        await mongoose.connection.close();
    } catch (error) {
        console.error('Error clearing database:', error);
        process.exit(1);
    }
};

clearDatabase();
