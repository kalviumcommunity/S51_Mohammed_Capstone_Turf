const mongoose = require('mongoose');
require('dotenv').config(); 

const connectDB = async () => {
    console.log(process.env.DATABASE_URI);
    try {
        await mongoose.connect(process.env.DATABASE_URI);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log(error.message);
    }
};

module.exports = connectDB; 
