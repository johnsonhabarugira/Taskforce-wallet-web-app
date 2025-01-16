import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Typography, Table, Button, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import StatisticsChart from '../components/StatisticsChart';
import PieChart from '../components/PieChart';
import DefaultLayout from '../components/DefaultLayout';
import axios from 'axios';

const { Title } = Typography;

const Home = () => {
  const [data, setData] = useState({
    income: 0,
    expenses: 0,
    totalIncome: 0,
    totalExpenses: 0,
    transactions: [],
    pieChartData: [],
  });

  const navigate = useNavigate();

  // Fetch data
  const fetchData = async () => {
    try {
      const { data: summary } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/summary/summary`);
      const { data: transactions } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/summary/transactions/recent`);
      setData({
        income: summary.monthlyIncome,
        expenses: summary.monthlyExpenses,
        totalIncome: summary.totalIncome,
        totalExpenses: summary.totalExpenses,
        transactions,
        pieChartData: summary.pieChartData,
      });
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleNavigate = (path) => {
    navigate(path);
  };

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
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
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
    },
  ];

  return (
    <DefaultLayout>
      <div style={{ padding: '20px',backgroundColor: '#f0f2f5' }}>
        {/* Top Buttons */}
        <Row gutter={16} style={{ marginBottom: '20px' }}>
          <Col span={24}>
            <Space>
              <Button type="primary" onClick={() => handleNavigate('/accounts')}>
                Add Account
              </Button>
              <Button type="primary" onClick={() => handleNavigate('/transactions')}>
                Add Transaction
              </Button>
              <Button type="default" onClick={() => handleNavigate('/reports')}>
                Go to Reports
              </Button>
            </Space>
          </Col>
        </Row>

        {/* Top Row: Summary Cards */}
        <Row gutter={16} style={{ marginBottom: '20px' }}>
          <Col span={6}>
            <Card style={{ height: '120px' }}>
              <Title level={5}>Income (This Month)</Title>
              <p>RWF {data.income}</p>
            </Card>
          </Col>
          <Col span={6}>
            <Card style={{ height: '120px' }}>
              <Title level={5}>Expenses (This Month)</Title>
              <p>RWF {data.expenses}</p>
            </Card>
          </Col>
          <Col span={6}>
            <Card style={{ height: '120px' }}>
              <Title level={5}>Total Income</Title>
              <p>RWF {data.totalIncome}</p>
            </Card>
          </Col>
          <Col span={6}>
            <Card style={{ height: '120px' }}>
              <Title level={5}>Total Expenses</Title>
              <p>RWF{data.totalExpenses}</p>
            </Card>
          </Col>
        </Row>

        {/* Second Row: Charts */}
        <Row gutter={16} style={{ marginBottom: '20px' }}>
          <Col span={16}>
            <Card >
              <Title level={5}>Income & Expenses Statistics</Title>
              <StatisticsChart data={data.transactions} />
            </Card>
          </Col>
          <Col span={8}>
            <Card >
              <Title level={5}>Expenses by Category</Title>
              <PieChart data={data.pieChartData} />
            </Card>
          </Col>
        </Row>

        {/* Third Row: Recent Transactions */}
        <Row>
          <Col span={24}>
            <Card>
              <Title level={5}>Recent Transactions</Title>
              <Table
                dataSource={data.transactions}
                columns={columns}
                rowKey={(record) => record.date + record.category}
                pagination={{ pageSize: 5 }}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </DefaultLayout>
  );
};

export default Home;
