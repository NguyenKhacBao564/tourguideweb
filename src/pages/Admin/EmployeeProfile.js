import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Users, Building } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../styles/admin/_profile.scss';

const EmployeeProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);

  // Sample employee data - In a real app, this would come from an API
  const employeeData = {
    1: {
      name: "Nguyễn Văn A",
      email: "nguyenvana@example.com",
      phone: "0123456789",
      address: "123 Đường Lê Duẩn, Cầu Giấy, Hà Nội",
      position: "Nhân viên bán hàng",
      branch: "Hà Nội",
      status: "active"
    },
    2: {
      name: "Trần Thị B",
      email: "tranthib@example.com",
      phone: "0987654321",
      address: "456 Đường Nguyễn Huệ, Quận 1, TP HCM",
      position: "Quản lý chi nhánh",
      branch: "TP HCM",
      status: "active"
    },
    3: {
      name: "Lê Văn C",
      email: "levanc@example.com",
      phone: "0369852147",
      address: "789 Đường Trần Hưng Đạo, Hồng Bàng, Hải Phòng",
      position: "Nhân viên bán hàng",
      branch: "Hải Phòng",
      status: "inactive"
    },
    4: {
      name: "Phạm Thị D",
      email: "phamthid@example.com",
      phone: "0741852963",
      address: "321 Đường Lê Duẩn, Hải Châu, Đà Nẵng",
      position: "Nhân viên bán hàng",
      branch: "Hà Nội",
      status: "active"
    },
    5: {
      name: "Hoàng Văn E",
      email: "hoangvane@example.com",
      phone: "0159753468",
      address: "654 Đường Trần Phú, Lộc Thọ, Nha Trang",
      position: "Quản lý chi nhánh",
      branch: "TP HCM",
      status: "active"
    }
  };

  useEffect(() => {
    // In a real app, you would fetch the employee data from an API
    const employeeDetails = employeeData[id];
    if (employeeDetails) {
      setEmployee(employeeDetails);
    } else {
      // Handle case when employee is not found
      navigate('/admin/nhan-vien');
    }
  }, [id, navigate]);

  if (!employee) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-page">
      <div className="page-header">
        <h2>Thông tin nhân viên</h2>
        <button className="logout-button" onClick={() => navigate('/admin/nhan-vien')}>Quay lại</button>
      </div>
      
      <div className="profile-card">
        <div className="profile-header">
          <img src="/avt.jpg" alt="Profile Avatar" className="profile-avatar" />
          <div className="profile-info">
            <h3>{employee.name}</h3>
            <button className="avatar-button">Đổi ảnh hồ sơ</button>
          </div>
          <div className="account-status">
            <span className="status-label">Trạng thái tài khoản:</span>
            <span className={`status-badge ${employee.status === 'active' ? 'status-active' : 'status-inactive'}`}>
              {employee.status === 'active' ? 'Đang hoạt động' : 'Đã nghỉ việc'}
            </span>
          </div>
        </div>
        
        <div className="profile-content">
          <div className="profile-section">
            <h4>Thông tin nhân viên</h4>
            <div className="input-group">
              <label htmlFor="fullname">Họ và tên</label>
              <input type="text" id="fullname" defaultValue={employee.name} />
            </div>
            
            <div className="input-group">
              <label htmlFor="phone">Số điện thoại</label>
              <div className="input-with-icon">
                <span className="input-icon"><Phone size={16} /></span>
                <input type="tel" id="phone" defaultValue={employee.phone} />
              </div>
            </div>
            
            <div className="input-group">
              <label htmlFor="address">Địa chỉ</label>
              <div className="input-with-icon">
                <span className="input-icon"><MapPin size={16} /></span>
                <input type="text" id="address" defaultValue={employee.address} />
              </div>
            </div>
            
            <div className="input-group">
              <label htmlFor="role">Phân quyền</label>
              <div className="input-with-icon">
                <span className="input-icon"><Users size={16} /></span>
                <select id="role" defaultValue={employee.position === "Quản lý chi nhánh" ? "admin" : "business"}>
                  <option value="business">Nhân viên kinh doanh</option>
                  <option value="admin">Quản trị viên</option>
                  <option value="guide">Hướng dẫn viên</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="profile-section">
            <h4>Thông tin tài khoản</h4>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <div className="input-with-icon">
                <span className="input-icon"><Mail size={16} /></span>
                <input type="email" id="email" defaultValue={employee.email} />
              </div>
            </div>
            
            <div className="input-group">
              <label htmlFor="password">Mật khẩu</label>
              <input type="password" id="password" defaultValue="********" />
            </div>
            
            <div className="input-group">
              <label htmlFor="branch">Chi nhánh</label>
              <div className="input-with-icon">
                <span className="input-icon"><Building size={16} /></span>
                <select id="branch" defaultValue={employee.branch.toLowerCase().replace(' ', '')}>
                  <option value="hanoi">Hà Nội</option>
                  <option value="hcm">Hồ Chí Minh</option>
                  <option value="danang">Đà Nẵng</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        <div className="profile-actions">
          <button className="lock-button">Khóa tài khoản</button>
          <button className="save-button">Lưu cập nhật</button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile; 