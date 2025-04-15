import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import '../../../styles/admin/admin.scss';

const MainLayout = () => {
  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-content">
        <Header />
        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout; 