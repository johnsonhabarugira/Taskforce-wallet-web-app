const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transactions');
const Account = require('../models/Acount');

// Get summary data
router.get('/summary', async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Calculate total income
    const totalIncome = await Transaction.aggregate([
      { $match: { type: 'Income' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    // Calculate total expenses
    const totalExpenses = await Transaction.aggregate([
      { $match: { type: 'Expense' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    // Calculate monthly income
    const monthlyIncome = await Transaction.aggregate([
      { $match: { type: 'Income', date: { $gte: startOfMonth, $lte: endOfMonth } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    // Calculate monthly expenses
    const monthlyExpenses = await Transaction.aggregate([
      { $match: { type: 'Expense', date: { $gte: startOfMonth, $lte: endOfMonth } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    // Get pie chart data
    const pieChartData = await Transaction.aggregate([
      { $match: { type: 'Expense' } },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
      { $project: { category: '$_id', amount: '$total', _id: 0 } }
    ]);

    res.status(200).json({
      totalIncome: totalIncome[0]?.total || 0,
      totalExpenses: totalExpenses[0]?.total || 0,
      monthlyIncome: monthlyIncome[0]?.total || 0,
      monthlyExpenses: monthlyExpenses[0]?.total || 0,
      pieChartData
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get recent transactions
router.get('/transactions/recent', async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ createdAt: -1 }).limit(5);
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get weekly statistics
router.get('/statistics/weekly', async (req, res) => {
  try {
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    console.log('Start of Week:', startOfWeek); // Add logging here
    console.log('End of Week:', endOfWeek); // Add logging here

    const weeklyData = await Transaction.aggregate([
      { $match: { date: { $gte: startOfWeek, $lte: endOfWeek } } },
      {
        $group: {
          _id: {
            week: { $week: '$date' },
            type: '$type',
          },
          total: { $sum: '$amount' },
        },
      },
      {
        $group: {
          _id: '$_id.week',
          data: {
            $push: {
              type: '$_id.type',
              total: '$total',
            },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    console.log('Weekly Data:', weeklyData); // Add logging here

    res.status(200).json(weeklyData);
  } catch (error) {
    console.error('Error fetching weekly statistics:', error); // Add logging here
    res.status(500).json({ error: error.message });
  }
});

// Get last 4 weeks of current month statistics
router.get('/statistics/last4weeks', async (req, res) => {
  try {
    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfCurrentMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const startOfWeek1 = new Date(startOfCurrentMonth);
    const endOfWeek1 = new Date(startOfWeek1);
    endOfWeek1.setDate(endOfWeek1.getDate() + 6);

    const startOfWeek2 = new Date(endOfWeek1);
    startOfWeek2.setDate(startOfWeek2.getDate() + 1);
    const endOfWeek2 = new Date(startOfWeek2);
    endOfWeek2.setDate(endOfWeek2.getDate() + 6);

    const startOfWeek3 = new Date(endOfWeek2);
    startOfWeek3.setDate(startOfWeek3.getDate() + 1);
    const endOfWeek3 = new Date(startOfWeek3);
    endOfWeek3.setDate(endOfWeek3.getDate() + 6);

    const startOfWeek4 = new Date(endOfWeek3);
    startOfWeek4.setDate(startOfWeek4.getDate() + 1);
    const endOfWeek4 = new Date(endOfCurrentMonth);

    console.log('Start of Week 1:', startOfWeek1);
    console.log('End of Week 1:', endOfWeek1);
    console.log('Start of Week 2:', startOfWeek2);
    console.log('End of Week 2:', endOfWeek2);
    console.log('Start of Week 3:', startOfWeek3);
    console.log('End of Week 3:', endOfWeek3);
    console.log('Start of Week 4:', startOfWeek4);
    console.log('End of Week 4:', endOfWeek4);

    const weeklyData = await Transaction.aggregate([
      { $match: { date: { $gte: startOfWeek1, $lte: endOfWeek4 } } },
      {
        $group: {
          _id: {
            week: {
              $cond: [
                { $lte: ['$date', endOfWeek1] },
                1,
                {
                  $cond: [
                    { $lte: ['$date', endOfWeek2] },
                    2,
                    {
                      $cond: [
                        { $lte: ['$date', endOfWeek3] },
                        3,
                        4,
                      ],
                    },
                  ],
                },
              ],
            },
            type: '$type',
          },
          total: { $sum: '$amount' },
        },
      },
      {
        $group: {
          _id: '$_id.week',
          data: {
            $push: {
              type: '$_id.type',
              total: '$total',
            },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Ensure all weeks are included
    const allWeeks = [1, 2, 3, 4];
    const result = allWeeks.map(week => {
      const weekData = weeklyData.find(w => w._id === week);
      return weekData || { _id: week, data: [{ type: 'Income', total: 0 }, { type: 'Expense', total: 0 }] };
    });

    console.log('Weekly Data:', result);

    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching weekly statistics:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;