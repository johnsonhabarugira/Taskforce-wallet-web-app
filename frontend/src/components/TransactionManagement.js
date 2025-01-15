import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, message } from 'antd';
import axios from 'axios';

const { Option } = Select;

const TransactionManagement = () => {
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState(null);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);

  useEffect(() => {
    fetchTransactions();
    fetchTotalIncome();
    fetchTotalExpenses();
    fetchAccounts();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/transactions');
      setTransactions(response.data);
    } catch (error) {
      message.error('Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  const fetchTotalIncome = async () => {
    try {
      const response = await axios.get('/api/transactions/total-income');
      setTotalIncome(response.data.totalIncome);
    } catch (error) {
      message.error('Failed to fetch total income');
    }
  };

  const fetchTotalExpenses = async () => {
    try {
      const response = await axios.get('/api/transactions/total-expenses');
      setTotalExpenses(response.data.totalExpenses);
    } catch (error) {
      message.error('Failed to fetch total expenses');
    }
  };

  const fetchAccounts = async () => {
    try {
      const response = await axios.get('/api/accounts');
      setAccounts(response.data);
    } catch (error) {
      message.error('Failed to fetch accounts');
    }
  };

  const handleAdd = () => {
    setCurrentTransaction(null);
    setIsModalVisible(true);
  };

  const handleEdit = (transaction) => {
    setCurrentTransaction(transaction);
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/transactions/${id}`);
      message.success('Transaction deleted successfully');
      fetchTransactions();
      fetchTotalIncome();
      fetchTotalExpenses();
    } catch (error) {
      message.error('Failed to delete transaction');
    }
  };

  const handleOk = async (values) => {
    try {
      if (currentTransaction) {
        await axios.put(`/api/transactions/edit/${currentTransaction._id}`, values);
        message.success('Transaction updated successfully');
      } else {
        await axios.post('/api/transactions/add', values);
        message.success('Transaction added successfully');
      }
      fetchTransactions();
      fetchTotalIncome();
      fetchTotalExpenses();
      setIsModalVisible(false);
    } catch (error) {
      console.error('Error saving transaction:', error);
      message.error('Failed to save transaction');
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const columns = [
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'Account',
      dataIndex: ['account', 'name'],
      key: 'account',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <>
          <Button onClick={() => handleEdit(record)}>Edit</Button>
          <Button onClick={() => handleDelete(record._id)} danger>Delete</Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <Button type="primary" onClick={handleAdd}>Add Transaction</Button>
      <Table columns={columns} dataSource={transactions} loading={loading} rowKey="_id" />
      <div>
        <h3>Total Income: {totalIncome}</h3>
        <h3>Total Expenses: {totalExpenses}</h3>
      </div>
      <Modal
        title={currentTransaction ? 'Edit Transaction' : 'Add Transaction'}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          initialValues={currentTransaction}
          onFinish={handleOk}
        >
          <Form.Item
            label="Type"
            name="type"
            rules={[{ required: true, message: 'Please select the transaction type!' }]}
          >
            <Select>
              <Option value="Income">Income</Option>
              <Option value="Expense">Expense</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Amount"
            name="amount"
            rules={[{ required: true, message: 'Please input the transaction amount!' }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            label="Account"
            name="account"
            rules={[{ required: true, message: 'Please select the account!' }]}
          >
            <Select>
              {accounts.map(account => (
                <Option key={account._id} value={account._id}>{account.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Category"
            name="category"
            rules={[{ required: true, message: 'Please input the transaction category!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {currentTransaction ? 'Update' : 'Add'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TransactionManagement;