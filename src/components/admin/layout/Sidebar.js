import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Users, Map, Building, LogOut } from 'lucide-react';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="6" width="28" height="20" rx="2" stroke="#2C5FE9" strokeWidth="2"/>
          <path d="M2 10H30" stroke="#2C5FE9" strokeWidth="2"/>
          <path d="M6 16H10" stroke="#2C5FE9" strokeWidth="2"/>
          <path d="M6 20H16" stroke="#2C5FE9" strokeWidth="2"/>
        </svg>
        <div>
          <span className="text-slate-500">tour</span>
          <span className="text-slate-700">guide</span>
        </div>
      </div>

      <div className="sidebar-menu">
        <NavLink to="/admin" className={({isActive}) => `sidebar-item ${isActive ? 'active' : ''}`}>
          <Home size={18} />
          <span>Tổng quan</span>
        </NavLink>
        <NavLink to="/admin/nhan-vien" className={({isActive}) => `sidebar-item ${isActive ? 'active' : ''}`}>
          <Users size={18} />
          <span>Nhân viên</span>
        </NavLink>
        <NavLink to="/admin/quan-ly-tour" className={({isActive}) => `sidebar-item ${isActive ? 'active' : ''}`}>
          <Map size={18} />
          <span>Quản lý Tour</span>
        </NavLink>
        <NavLink to="/admin/quan-ly-chi-nhanh" className={({isActive}) => `sidebar-item ${isActive ? 'active' : ''}`}>
          <Building size={18} />
          <span>Quản lý chi nhánh</span>
        </NavLink>
        <div className="mt-auto">
          <NavLink to="/admin/dang-xuat" className={({isActive}) => `sidebar-item ${isActive ? 'active' : ''}`}>
            <LogOut size={18} />
            <span>Đăng xuất</span>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 