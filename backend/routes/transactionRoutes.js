const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transactions');
const Account = require('../models/Acount');

// Create a transaction
router.post('/add', async (req, res) => {
  try {
    const { type, amount, account, category } = req.body;

    if (!type || !amount || !account || !category) {
      return res.status(400).json({ error: 'Type, amount, account, and category are required' });
    }

    const accountToUpdate = await Account.findById(account);
    if (!accountToUpdate) {
      return res.status(404).json({ error: 'Account not found' });
    }
    if (accountToUpdate.limit !== Infinity && type === 'Expense' && accountToUpdate.balance - amount < accountToUpdate.limit) {
      return res.status(400).json({ error: 'Transaction exceeds the account limit' });
    }

    const transaction = new Transaction(req.body);
    const savedTransaction = await transaction.save();

    if (type === 'Income') {
      accountToUpdate.balance += amount;
    } else if (type === 'Expense') {
      accountToUpdate.balance -= amount;
    }
    await accountToUpdate.save();

    res.status(201).json(savedTransaction);
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ error: error.message });
  }
});

// Edit a transaction
router.put('/edit/:id', async (req, res) => {
  try {
    const { type, amount, account } = req.body;

    if (!type || !amount || !account) {
      return res.status(400).json({ error: 'Type, amount, and account are required' });
    }

    const accountToUpdate = await Account.findById(account);
    if (!accountToUpdate) {
      return res.status(404).json({ error: 'Account not found' });
    }

    if (accountToUpdate.limit !== Infinity && type === 'Expense' && accountToUpdate.balance - amount < accountToUpdate.limit) {
      return res.status(400).json({ error: 'Transaction exceeds the account limit' });
    }

    const updatedTransaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedTransaction);
  } catch (error) {
    console.error('Error updating transaction:', error);
    res.status(500).json({ error: error.message });
  }
});


// Get all transactions
router.get('/', async (req, res) => {
  try {
    const transactions = await Transaction.find().populate('account'); 
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get transactions by account
router.get('/transactions/account/:accountId', async (req, res) => {
  try {
    const transactions = await Transaction.find({ account: req.params.accountId });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get total income
router.get('/total-income', async (req, res) => {
    try {
      const totalIncome = await Transaction.aggregate([
        { $match: { type: 'Income' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]);
      res.status(200).json({ totalIncome: totalIncome[0]?.total || 0 });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Get total expenses
  router.get('/total-expenses', async (req, res) => {
    try {
      const totalExpenses = await Transaction.aggregate([
        { $match: { type: 'Expense' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]);
      res.status(200).json({ totalExpenses: totalExpenses[0]?.total || 0 });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  router.delete('/:id', async (req, res) => {
    try {
      console.log('Deleting transaction with ID:', req.params.id);
  
      const transaction = await Transaction.findById(req.params.id);
      if (!transaction) {
        console.log('Transaction not found');
        return res.status(404).json({ error: 'Transaction not found' });
      }
  
      console.log('Found transaction:', transaction);
  
      const account = await Account.findById(transaction.account);
      if (!account) {
        console.log('Account not found');
        return res.status(404).json({ error: 'Account not found' });
      }
  
      console.log('Found account:', account);
  
      // Update balance based on the transaction type
      if (transaction.type === 'Income') {
        account.balance -= transaction.amount;
      } else if (transaction.type === 'Expense') {
        account.balance += transaction.amount;
      }
      await account.save();
  
      // Delete the transaction
      await Transaction.findByIdAndDelete(req.params.id);
      console.log('Transaction deleted successfully');
  
      res.status(200).json({ message: 'Transaction deleted successfully' });
    } catch (error) {
      console.error('Error deleting transaction:', error);
      res.status(500).json({ error: error.message });
    }
  });
  
module.exports = router;
