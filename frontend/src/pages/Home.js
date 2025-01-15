import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Typography, Table } from 'antd';
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

  // Fetch data
  const fetchData = async () => {
    try {
      const { data: summary } = await axios.get('/api/summary/summary');
      const { data: transactions } = await axios.get('/api/summary/transactions/recent');
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
      <div style={{ padding: '20px' }}>
        {/* Top Row: Summary Cards */}
        <Row gutter={16} style={{ marginBottom: '20px' }}>
          <Col span={6}>
            <Card>
              <Title level={5}>Income (This Month)</Title>
              <p>${data.income}</p>
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Title level={5}>Expenses (This Month)</Title>
              <p>${data.expenses}</p>
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Title level={5}>Total Income</Title>
              <p>${data.totalIncome}</p>
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Title level={5}>Total Expenses</Title>
              <p>${data.totalExpenses}</p>
            </Card>
          </Col>
        </Row>

        {/* Second Row: Charts */}
        <Row gutter={16} style={{ marginBottom: '20px' }}>
          <Col span={16}>
            <Card>
              <Title level={5}>Income & Expenses Statistics</Title>
              <StatisticsChart data={data.transactions} />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
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
