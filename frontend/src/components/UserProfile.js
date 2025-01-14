import React from 'react';
import { Card } from 'antd';

const UserProfile = ({ user }) => {
  return (
    <Card title="User Profile">
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
    </Card>
  );
};

export default UserProfile;