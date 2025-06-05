import React from 'react';
import UserProfileForm from '../../components/forms/UserProfileForm';

/**
 * User profile page component
 */
const ProfilePage: React.FC = () => {
  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
      <div className="max-w-2xl">
        <UserProfileForm />
      </div>
    </div>
  );
};

export default ProfilePage;
