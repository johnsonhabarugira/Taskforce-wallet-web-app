const mongoose = require("mongoose");

const connectDB = async () => {
  // MongoDB connection URI
  const mongoURI = process.env.MONGO_URI;
  
  // Connect to MongoDB
  mongoose.connect(mongoURI, {
    // Remove deprecated options
  }).then(() => {
    console.log('MongoDB connected...');
  }).catch(err => {
    console.error('MongoDB connection error:', err);
  });
  
};

module.exports = connectDB;


