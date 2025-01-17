import React, { useState, useEffect } from 'react';
import { Table, message, Button, DatePicker } from 'antd';
import axios from 'axios';
import * as XLSX from 'xlsx';
import DefaultLayout from '../components/DefaultLayout';

const { RangePicker } = DatePicker;

const Reports = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/transactions`);
      setTransactions(response.data);
      setFilteredTransactions(response.data);
    } catch (error) {
      message.error('Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  const handleDateFilter = (dates) => {
    if (!dates || dates.length === 0) {
      setFilteredTransactions(transactions); 
    } else {
      const [startDate, endDate] = dates;
      const filtered = transactions.filter((transaction) => {
        const transactionDate = new Date(transaction.date);
        return transactionDate >= startDate && transactionDate <= endDate;
      });
      setFilteredTransactions(filtered);
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredTransactions);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions');
    XLSX.writeFile(workbook, 'Reports.xlsx');
  };

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => `RWF ${amount.toFixed(2)}`, 
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (type === 'credit' ? 'Credit' : 'Debit'),
    },
  ];

  return (
    <div>
        <DefaultLayout>
      <h2>Transactions</h2>
      <div style={{ marginBottom: '20px' }}>
        {/* Date Range Picker */}
        <RangePicker onChange={(dates) => handleDateFilter(dates)} />
        {/* Export Button */}
        <Button type="primary" style={{ marginLeft: '10px' }} onClick={exportToExcel}>
          Export to Excel
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={filteredTransactions}
        loading={loading}
        rowKey="_id" 
      />
      </DefaultLayout>
    </div>
  );
};

export default Reports;
