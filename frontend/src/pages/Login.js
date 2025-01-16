import React, { useState } from 'react';
import { Modal, Form, Input, Button, message, Layout, Typography } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const { Header, Content } = Layout;
const { Title, Paragraph } = Typography;

const Login = () => {
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const [isRegisterModalVisible, setIsRegisterModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle modal visibility
  const showLoginModal = () => {
    setIsLoginModalVisible(true);
  };

  const showRegisterModal = () => {
    setIsRegisterModalVisible(true);
  };

  const handleCancel = () => {
    setIsLoginModalVisible(false);
    setIsRegisterModalVisible(false);
  };

  // Handle login form submission
  const handleLogin = async (values) => {
    try {
      setLoading(true);
      const response = await axios.post('/api/auth/login', values); // Adjust the URL as needed
      message.success('Login successful!');
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/home');
      setIsLoginModalVisible(false);
    } catch (error) {
      message.error('Login failed!');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (values) => {
    try {
      setLoading(true);
      await axios.post('/api/auth/register', values); // Adjust the URL as needed
      message.success('Registration successful!');
      setIsRegisterModalVisible(false); // Close the Register modal
      setIsLoginModalVisible(true); // Open the Login modal
    } catch (error) {
      message.error('Registration failed!');
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Layout>
      <Header style={{ backgroundColor: 'black', color: '#fff', textAlign: 'center' }}>
        <Title level={3} style={{ color: '#fff', margin: 0 }}>
          Welcome to Wallet App
        </Title>
      </Header>

      <Content style={{ padding: '50px', textAlign: 'center' }}>
        <Title level={2}>Your One-Stop Solution</Title>
        <Paragraph>
          Experience the best tools and services to simplify your work and achieve your goals.
        </Paragraph>
        <Button type="primary" size="large" onClick={showLoginModal}>
          Login
        </Button>
        <Button type="default" size="large" onClick={showRegisterModal} style={{ marginLeft: '10px' }}>
          Register
        </Button>
      </Content>

      {/* Login Modal */}
      <Modal
        title="Login"
        visible={isLoginModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={handleLogin}
          onFinishFailed={onFinishFailed}
          layout="vertical"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Please input your email!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Login
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Register Modal */}
      <Modal
        title="Register"
        visible={isRegisterModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          name="register"
          onFinish={handleRegister}
          onFinishFailed={onFinishFailed}
          layout="vertical"
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please input your name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Please input your email!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Register
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default Login;
