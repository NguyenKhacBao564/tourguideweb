import React from 'react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import EmployeeProfile from './EmployeeProfile';
import '../styles/admin/index.scss';

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <AdminHeader title="Quản lý nhân viên" />
        <div className="admin-content">
          <EmployeeProfile />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout; 