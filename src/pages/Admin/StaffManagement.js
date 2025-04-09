import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, MoreVertical } from 'lucide-react';

const StaffManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Sample staff data
  const staffData = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      email: "nguyenvana@example.com",
      phone: "0123456789",
      position: "Nhân viên bán hàng",
      branch: "Hà Nội",
      status: "active"
    },
    {
      id: 2,
      name: "Trần Thị B",
      email: "tranthib@example.com",
      phone: "0987654321",
      position: "Quản lý chi nhánh",
      branch: "TP HCM",
      status: "active"
    },
    {
      id: 3,
      name: "Lê Văn C",
      email: "levanc@example.com",
      phone: "0369852147",
      position: "Nhân viên bán hàng",
      branch: "Hải Phòng",
      status: "inactive"
    },
    {
      id: 4,
      name: "Phạm Thị D",
      email: "phamthid@example.com",
      phone: "0741852963",
      position: "Nhân viên bán hàng",
      branch: "Hà Nội",
      status: "active"
    },
    {
      id: 5,
      name: "Hoàng Văn E",
      email: "hoangvane@example.com",
      phone: "0159753468",
      position: "Quản lý chi nhánh",
      branch: "TP HCM",
      status: "active"
    }
  ];

  // Filter staff based on search term
  const filteredStaff = staffData.filter(staff => 
    staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="admin-title">Quản lý nhân viên</h2>
        <button className="btn btn-primary">
          <Plus size={16} />
          <span>Thêm nhân viên</span>
        </button>
      </div>

      <div className="table-container">
        <div className="table-header">
          <div className="input-group">
            <input 
              type="text" 
              placeholder="Tìm kiếm nhân viên..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="input-group-icon">
              <Search size={16} />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Tên nhân viên</th>
                <th>Email</th>
                <th>Số điện thoại</th>
                <th>Vị trí</th>
                <th>Chi nhánh</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredStaff.map((staff) => (
                <tr key={staff.id}>
                  <td className="font-medium">{staff.name}</td>
                  <td>{staff.email}</td>
                  <td>{staff.phone}</td>
                  <td>{staff.position}</td>
                  <td>{staff.branch}</td>
                  <td>
                    <span className={`status-badge ${staff.status === 'active' ? 'status-active' : 'status-inactive'}`}>
                      {staff.status === 'active' ? 'Đang làm việc' : 'Đã nghỉ việc'}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <button className="btn btn-light p-1">
                        <Edit size={16} />
                      </button>
                      <button className="btn btn-light p-1">
                        <Trash2 size={16} />
                      </button>
                      <button className="btn btn-light p-1">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Hiển thị {filteredStaff.length} nhân viên
          </div>
          <div className="pagination">
            <div className="page-item active">1</div>
            <div className="page-item">2</div>
            <div className="page-item">3</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffManagement; 