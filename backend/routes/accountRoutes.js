const express = require('express');
const router = express.Router();
const Account = require('../models/Acount');
//@route   POST /api/account/add
// Create an account
router.post('/add', async (req, res) => {
  try {
    const { name, type, balance, limit } = req.body;

    const account = new Account({
      name,
      type,
      balance: balance || 0,
      limit: limit !== undefined ? limit : Infinity, 
    });

    const savedAccount = await account.save();
    res.status(201).json(savedAccount);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
//@route   GET /api/account/
// Get all accounts
router.get('/', async (req, res) => {
  try {
    const accounts = await Account.find();
    res.status(200).json(accounts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
//@route   PUT /api/account/edit/:id
// Update account balance
router.put('/edit/:id', async (req, res) => {
  try {
    const updatedAccount = await Account.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(updatedAccount);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
//@route   POST /api/account/delete/:id
// Delete an account
router.delete('/delete/:id', async (req, res) => {
  try {
    await Account.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
