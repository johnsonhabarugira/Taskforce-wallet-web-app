const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Income', 'Expense'],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    trim: true, 
  },
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account', 
    required: true,
  },
  category: {
    type: String,
    required: true, 
  },
  date: {
    type: Date,
    default: Date.now, 
  },
});

module.exports = mongoose.model('Transaction', TransactionSchema);
