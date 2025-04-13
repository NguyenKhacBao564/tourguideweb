import React from 'react';
import { Home, Users, Box, Map, LogOut } from 'lucide-react';
import logoImage from '../assets/logo.svg';
import '../styles/admin/_sidebar.scss';

const AdminSidebar = () => {
  return (
    <aside className="sidebar">
      <div className="logo-container">
        <div className="logo">
          <img src={logoImage} alt="Tour Guide Logo" />
        </div>
        <div className="logo-text">tour guide</div>
      </div>
      <nav>
        <ul className="nav-list">
          <li>
            <a href="#" className="nav-item">
              <span className="nav-icon"><Home size={18} /></span>
              Tổng quan
            </a>
          </li>
          <li>
            <a href="#" className="nav-item active">
              <span className="nav-icon"><Users size={18} /></span>
              Nhân viên
            </a>
          </li>
          <li>
            <a href="#" className="nav-item">
              <span className="nav-icon"><Box size={18} /></span>
              Quản lý Tour
            </a>
          </li>
          <li>
            <a href="#" className="nav-item">
              <span className="nav-icon"><Map size={18} /></span>
              Quản lý chi nhánh
            </a>
          </li>
          <li>
            <a href="#" className="nav-item logout">
              <span className="nav-icon"><LogOut size={18} /></span>
              Đăng xuất
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default AdminSidebar; 