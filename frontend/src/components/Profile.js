import React, { useEffect, useState } from 'react';
import { Card, Button, message } from 'antd';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState(null);
  const history = useHistory();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      history.push('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/auth/profile', {
          headers: { Authorization: token },
        });
        setUser(response.data);
      } catch (error) {
        message.error('Failed to fetch profile!');
      }
    };

    fetchProfile();
  }, [history]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    history.push('/login');
  };

  if (!user) return null;

  return (
    <div style={{ maxWidth: 400, margin: '0 auto' }}>
      <Card title="User Profile" bordered={false}>
        <p>Name: {user.name}</p>
        <p>Email: {user.email}</p>
        <Button type="primary" onClick={handleLogout}>
          Logout
        </Button>
      </Card>
    </div>
  );
};

export default Profile;
