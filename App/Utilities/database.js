const mongoose = require('mongoose');

const connectDataBase = async () => {
    const MONGO_URL = process.env.MONGO_URL
    try {
        if (!MONGO_URL) {
            throw new Error('MONGO_URL is not defined');
        }
       await mongoose.connect(MONGO_URL)
       console.log('MongoDB connected sucessfully');
    } catch (error) {
        console.log("Error while connect MongoDB",error)
    }
}

module.exports = connectDataBase