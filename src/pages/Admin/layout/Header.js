import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';
//import AdminProfile from '../AdminProfile';

const Header = () => {
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  // lấy id của nhân viên
  const staffId = auth?.user?.user_id;

  const handleAvatarClick = () => {
    if (staffId) {
      navigate(`/admin/nhan-vien/${staffId}`);
    } else {
      // Fallback if user ID is not available (e.g., not logged in)
      navigate('/admin/nhan-vien');
    }
  };

  return (
    <div className="admin-header">
      <h1 className="admin-title">Admin</h1>
      <div className="admin-profile">
      <div className="avatar-container" onClick={handleAvatarClick}>
        <img 
          src="/userAvartar/IMG_3955.JPG" 
          alt="Admin Avatar" 
          className="avatar"
        />
      </div>
    </div>
    </div>
  );
};

export default Header; 