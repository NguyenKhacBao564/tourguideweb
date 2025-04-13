import React from 'react';
import AdminProfile from '../AdminProfile';

const Header = () => {
  return (
    <div className="admin-header">
      <h1 className="admin-title">Admin</h1>
      <AdminProfile />
    </div>
  );
};

export default Header; 