// src/pages/Profile.jsx
import React from 'react';

const Profile = () => {
  return (
    <div>
      <h1 className="text-center text-2xl font-bold">User Profile</h1>
      <div className="mt-4 p-4 border border-gray-300 rounded">
        <h2 className="text-xl">Name: John Doe</h2>
        <p className="mt-2">Email: johndoe@example.com</p>
        <p className="mt-2">Member Since: January 2023</p>
        <p className="mt-2">Location: New York, USA</p>
      </div>
    </div>
  );
};

export default Profile;
