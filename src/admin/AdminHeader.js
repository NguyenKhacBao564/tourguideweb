import React from 'react';
import avatarImage from '../assets/avatar.png';
import '../styles/admin/_header.scss';

const AdminHeader = ({ title }) => {
  return (
    <header className="header">
      <h1>{title}</h1>
      <div className="avatar-container">
        <img src={avatarImage} alt="User Avatar" className="avatar" />
      </div>
    </header>
  );
};

export default AdminHeader; 