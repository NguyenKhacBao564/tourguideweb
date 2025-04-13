import React, { useState } from 'react';
import './AdminProfile.scss';

const AdminProfile = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="admin-profile">
      <div className="avatar-container" onClick={toggleDropdown}>
        <img 
          src="/userAvartar/IMG_3955.JPG" 
          alt="Admin Avatar" 
          className="avatar"
        />
      </div>
      
      {isOpen && (
        <div className="profile-dropdown">
          <div className="profile-header">
            <img 
              src="/userAvartar/IMG_3955.JPG" 
              alt="Admin Avatar" 
              className="profile-avatar"
            />
            <div className="profile-info">
              <h3>Admin Name</h3>
              <p>admin@example.com</p>
            </div>
          </div>
          <div className="profile-menu">
            <button className="menu-item">
              <span>Profile Settings</span>
            </button>
            <button className="menu-item">
              <span>Account Settings</span>
            </button>
            <button className="menu-item">
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProfile; 