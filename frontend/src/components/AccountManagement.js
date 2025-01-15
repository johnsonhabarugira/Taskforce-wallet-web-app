import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, message } from 'antd';
import axios from 'axios';
import DefaultLayout from '../components/DefaultLayout';

const { Option } = Select;

const AccountManagement = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentAccount, setCurrentAccount] = useState(null);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/accounts');
      setAccounts(response.data);
    } catch (error) {
      message.error('Failed to fetch accounts');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setCurrentAccount(null);
    setIsModalVisible(true);
  };

  const handleEdit = (account) => {
    setCurrentAccount(account);
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/accounts/delete/${id}`);
      message.success('Account deleted successfully');
      fetchAccounts();
    } catch (error) {
      message.error('Failed to delete account');
    }
  };

  const handleOk = async (values) => {
    try {
      if (currentAccount) {
        await axios.put(`/api/accounts/edit/${currentAccount._id}`, values);
        message.success('Account updated successfully');
      } else {
        await axios.post('/api/accounts/add', values);
        message.success('Account added successfully');
      }
      fetchAccounts();
      setIsModalVisible(false);
    } catch (error) {
      message.error('Failed to save account');
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Balance',
      dataIndex: 'balance',
      key: 'balance',
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
        <DefaultLayout>
      <Button type="primary" onClick={handleAdd}>Add Account</Button>
      <Table columns={columns} dataSource={accounts} loading={loading} rowKey="_id" />
      <Modal
        title={currentAccount ? 'Edit Account' : 'Add Account'}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          initialValues={currentAccount}
          onFinish={handleOk}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please input the account name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Type"
            name="type"
            rules={[{ required: true, message: 'Please select the account type!' }]}
          >
            <Select>
              <Option value="Bank">Bank</Option>
              <Option value="Mobile Money">Mobile Money</Option>
              <Option value="Cash">Cash</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Balance"
            name="balance"
            rules={[{ required: true, message: 'Please input the account balance!' }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {currentAccount ? 'Update' : 'Add'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      </DefaultLayout>
    </div>
  );
};

export default AccountManagement;