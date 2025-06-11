const mongoose = require('mongoose');
const config = require("./main.config")

const connectDB = async () => {
    try {
        await mongoose.connect(config.mongoURI);
        console.log('MongoDB connected successfully!');
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;