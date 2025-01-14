import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const response = await axios.post('/api/auth/login', values); // No need for full URL
      localStorage.setItem('token', response.data.token); // Store the token in localStorage
      message.success('Login successful!');
      navigate('/profile');
    } catch (error) {
      message.error('Login failed!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto' }}>
      <h2>Login</h2>
      <Form name="login" onFinish={onFinish} layout="vertical">
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: 'Please input your email!' }, { type: 'email' }]}
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
          <Button type="primary" htmlType="submit" loading={loading}>
            Login
          </Button>
        </Form.Item>
      </Form>
      <p>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
      <Button type="link">
        <Link to="/register">Go to Register</Link>
      </Button>
    </div>
  );
};

export default Login;
