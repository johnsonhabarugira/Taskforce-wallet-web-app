const mongoose = require("mongoose");

const connectDB = async () => {
  
  const mongoURI = process.env.MONGO_URI;
  
  
  mongoose.connect(mongoURI, {
    
  }).then(() => {
    console.log('MongoDB connected...');
  }).catch(err => {
    console.error('MongoDB connection error:', err);
  });
  
};

module.exports = connectDB;


