const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['Bank', 'Mobile Money', 'Cash'],
    required: true,
  },
  balance: {
    type: Number,
    default: 0, 
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  limit: {
    type: Number,
    default: Infinity, 
  },
});

module.exports = mongoose.model('Account', AccountSchema);
