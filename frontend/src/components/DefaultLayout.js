import React, { useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LineChartOutlined,
  BankOutlined,
  TransactionOutlined,
  UserOutlined,
  FileDoneOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme, Avatar, Dropdown, Modal } from 'antd';
import { Link, useNavigate } from 'react-router-dom';

const { Header, Sider, Content, Footer } = Layout;

const DefaultLayout = ({ children, currentUser }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // Get user info from token in localStorage
  const token = localStorage.getItem('token');
  let user = null;

  if (token) {
    try {
      const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode token to get user info
      const currentTime = Date.now() / 1000; // Current time in seconds

      // Check if the token is expired
      if (decodedToken.exp < currentTime) {
        // If expired, remove token and log out the user
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        user = {
          name: decodedToken.name,
          email: decodedToken.email,
          role: decodedToken.role,
        };
      }
    } catch (error) {
      console.error('Token decoding error:', error);
      localStorage.removeItem('token');
      navigate('/login');
    }
  }

  // Handle modal visibility
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="1">
        <Link onClick={showModal}>Profile</Link>
      </Menu.Item>
      <Menu.Item key="2" onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          position: 'fixed',
          height: '100vh',
          left: 0,
          overflow: 'auto',
        }}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          items={[
            {
              key: '1',
              icon: <LineChartOutlined />,
              label: <Link to="/home">Dashboard</Link>,
            },
            {
              key: '2',
              icon: <TransactionOutlined />,
              label: <Link to="/transactions">Transactions</Link>,
            },
            {
              key: '3',
              icon: <BankOutlined />,
              label: <Link to="/accounts">Accounts</Link>,
            },
            {
              key: '4',
              icon: <FileDoneOutlined />,
              label: <Link to="/reports">Reports</Link>,
            },
          ]}
        />
      </Sider>
      <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: 'margin-left 0.2s' }}>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          <div style={{ float: 'right', marginRight: '16px' }}>
            <Dropdown overlay={userMenu}>
              <span style={{ cursor: 'pointer' }}>
                <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
                {user && (
                  <>
                    <span style={{ marginLeft: '8px' }}>{user.name}</span>
                    <span style={{ marginLeft: '8px', color: 'rgba(0, 0, 0, 0.45)' }}>{user.email}</span>
                  </>
                )}
              </span>
            </Dropdown>
          </div>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 'calc(100vh - 134px)',
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </Content>
        <Footer style={{ textAlign: 'center', position: 'sticky', bottom: 0 }}>
          ©2025 Created by CodeOfAfrica Applicant
        </Footer>
      </Layout>

      <Modal title="User Profile" open={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        {user && (
          <div>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
          </div>
        )}
      </Modal>
    </Layout>
  );
};

export default DefaultLayout;
