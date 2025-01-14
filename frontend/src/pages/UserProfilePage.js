import React from 'react';
import UserProfile from '../components/UserProfile';

const UserProfilePage = () => {
  // Mock user data
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
  };

  return (
    <div>
      <h2>User Profile</h2>
      <UserProfile user={user} />
    </div>
  );
};

export default UserProfilePage;