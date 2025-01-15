import React, { useState, useEffect } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
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
    localStorage.removeItem('token'); // Remove token from localStorage
    navigate('/login'); // Redirect to login page
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
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          items={[
            {
              key: '1',
              icon: <UserOutlined />,
              label: <Link to="/">Home</Link>,
            },
            {
              key: '2',
              icon: <VideoCameraOutlined />,
              label: <Link to="/about">About</Link>,
            },
            {
              key: '3',
              icon: <UploadOutlined />,
              label: 'nav 3',
            },
          ]}
        />
      </Sider>
      <Layout>
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
        <Content style={{ margin: '24px 16px', padding: 24, minHeight: 280, background: colorBgContainer, borderRadius: borderRadiusLG }}>
          {children}
        </Content>
        <Footer style={{ textAlign: 'center' }}>©2023 Created by CodeOfAfrica</Footer>
      </Layout>

      <Modal title="User Profile" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        {user && (
          <div>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
          </div>
        )}
      </Modal>
    </Layout>
  );
};

export default DefaultLayout;