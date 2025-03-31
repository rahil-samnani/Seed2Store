const mongoose = require('mongoose');
const mongoURI = 'mongodb://127.0.0.1:27017/Seed2Store';

const connectToMongo = () => {
    mongoose.connect(mongoURI).then(() => {
        console.log('Connected to MongoDB!');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });
}

module.exports = connectToMongo;