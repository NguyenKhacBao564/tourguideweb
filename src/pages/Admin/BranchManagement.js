import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, MoreVertical, MapPin, Phone, Mail, Users } from 'lucide-react';

const BranchManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Sample branch data
  const branchData = [
    {
      id: 1,
      name: "Chi nhánh Hà Nội",
      address: "123 Đường Lê Duẩn, Cầu Giấy, Hà Nội",
      phone: "024 1234 5678",
      email: "hanoi@tourguide.com",
      manager: "Nguyễn Văn A",
      staffCount: 15,
      status: "active"
    },
    {
      id: 2,
      name: "Chi nhánh TP HCM",
      address: "456 Đường Nguyễn Huệ, Quận 1, TP HCM",
      phone: "028 8765 4321",
      email: "hcmc@tourguide.com",
      manager: "Trần Thị B",
      staffCount: 20,
      status: "active"
    },
    {
      id: 3,
      name: "Chi nhánh Hải Phòng",
      address: "789 Đường Trần Hưng Đạo, Hồng Bàng, Hải Phòng",
      phone: "0225 9876 5432",
      email: "haiphong@tourguide.com",
      manager: "Lê Văn C",
      staffCount: 10,
      status: "inactive"
    },
    {
      id: 4,
      name: "Chi nhánh Đà Nẵng",
      address: "321 Đường Lê Duẩn, Hải Châu, Đà Nẵng",
      phone: "0236 4567 8901",
      email: "danang@tourguide.com",
      manager: "Phạm Thị D",
      staffCount: 12,
      status: "active"
    },
    {
      id: 5,
      name: "Chi nhánh Nha Trang",
      address: "654 Đường Trần Phú, Lộc Thọ, Nha Trang",
      phone: "0258 2345 6789",
      email: "nhatrang@tourguide.com",
      manager: "Hoàng Văn E",
      staffCount: 8,
      status: "active"
    }
  ];

  // Filter branches based on search term
  const filteredBranches = branchData.filter(branch => 
    branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    branch.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    branch.manager.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="admin-title">Quản lý chi nhánh</h2>
        <button className="btn btn-primary">
          <Plus size={16} />
          <span>Thêm chi nhánh</span>
        </button>
      </div>

      <div className="table-container">
        <div className="table-header">
          <div className="input-group">
            <input 
              type="text" 
              placeholder="Tìm kiếm chi nhánh..." 
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
                <th>Tên chi nhánh</th>
                <th>Địa chỉ</th>
                <th>Số điện thoại</th>
                <th>Email</th>
                <th>Quản lý</th>
                <th>Số nhân viên</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredBranches.map((branch) => (
                <tr key={branch.id}>
                  <td className="font-medium">{branch.name}</td>
                  <td>
                    <div className="flex items-center gap-1">
                      <MapPin size={14} />
                      <span>{branch.address}</span>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-1">
                      <Phone size={14} />
                      <span>{branch.phone}</span>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-1">
                      <Mail size={14} />
                      <span>{branch.email}</span>
                    </div>
                  </td>
                  <td>{branch.manager}</td>
                  <td>
                    <div className="flex items-center gap-1">
                      <Users size={14} />
                      <span>{branch.staffCount}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${branch.status === 'active' ? 'status-active' : 'status-inactive'}`}>
                      {branch.status === 'active' ? 'Đang hoạt động' : 'Tạm ngưng'}
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
            Hiển thị {filteredBranches.length} chi nhánh
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

export default BranchManagement; 