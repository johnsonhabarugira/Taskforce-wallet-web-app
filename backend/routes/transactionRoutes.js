const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transactions');
const Account = require('../models/Acount');

// Create a transaction
router.post('/add', async (req, res) => {
  try {
    const { type, amount, account } = req.body;

    // Save the transaction
    const transaction = new Transaction(req.body);
    const savedTransaction = await transaction.save();

    // Update the account balance
    const accountToUpdate = await Account.findById(account);
    if (type === 'Income') {
      accountToUpdate.balance += amount;
    } else if (type === 'Expense') {
      accountToUpdate.balance -= amount;
    }
    await accountToUpdate.save();

    res.status(201).json(savedTransaction);
  } catch (error) {
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

// Delete a transaction
router.delete('/transactions/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    // Update the account balance before deleting
    const account = await Account.findById(transaction.account);
    if (transaction.type === 'Income') {
      account.balance -= transaction.amount;
    } else if (transaction.type === 'Expense') {
      account.balance += transaction.amount;
    }
    await account.save();

    await transaction.remove();
    res.status(200).json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
