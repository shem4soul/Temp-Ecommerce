const mongoose = require('mongoose');

const connectDB = async (url) => {
  await mongoose.connect(url);
  console.log('MongoDB connected....');
  
};

module.exports = connectDB;

