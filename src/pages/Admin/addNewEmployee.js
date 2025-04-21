// src/pages/Admin/addNewEmployee.js
import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { Camera } from "lucide-react";
import '../../styles/admin/addNewEmployee.scss';
import axios from 'axios';
const AddNewEmployee = () => {
  const [preview, setPreview] = useState(null);
  const [form, setForm] = useState({
    fullname: "",
    phone: "",
    address: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    branch: ""
  });

  // 1. State để chứa danh sách chi nhánh và chi nhánh được chọn
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');

  // 2. Fetch khi mount
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const res = await axios.get('/api/admin/getBranch'); // hoặc '/api/getBranch' tuỳ cấu hình proxy
        // nếu backend trả về mảng recordset: [{ branch_name: 'Hà Nội' }, ...]
        setBranches(res.data);
      } catch (err) {
        console.error('Lỗi khi lấy chi nhánh:', err);
      }
    };
    fetchBranches();
  }, []);

  // 3. Xử lý khi user chọn
  const handleBranchChange = (e) => {
    setSelectedBranch(e.target.value);
  };
  
  const handleFileChange = e => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    // TODO: gửi data lên server
    console.log(form);
  };

  return (
    <div className="add-employee-page">
      <h2 className="page-title">Thêm nhân viên mới</h2>
      <div className="form-card">
        <div className="photo-upload">
          <input
            type="file"
            id="photo"
            accept="image/*"
            onChange={handleFileChange}
            hidden
          />
          <p className="photo-text">Chọn ảnh hồ sơ</p>
          <label htmlFor="photo" className="photo-label">
            {preview ? (
              <img src={preview} alt="avatar" className="photo-preview" />
            ) : (
              <div className="photo-placeholder">
                <Camera size={32} />
              </div>
            )}
          </label>
          
        </div>

        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <h5 className="section-title">Nhập thông tin nhân viên</h5>

              <Form.Group className="mb-3">
                <Form.Label>Họ và tên</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nguyen Van A"
                  name="fullname"
                  value={form.fullname}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Số điện thoại</Form.Label>
                <Form.Control
                  type="tel"
                  placeholder="09xxxxxxxx"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Địa chỉ</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nhập địa chỉ"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <h5 className="section-title">Tạo tài khoản</h5>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="info@gmail.com"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Mật khẩu</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Nhập mật khẩu"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Nhập lại mật khẩu</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Nhập lại mật khẩu"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="align-items-end">
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Phân quyền</Form.Label>
                <Form.Select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                >
                  <option value="">Chọn phân quyền</option>
                  <option value="Sales">Nhân viên kinh doanh</option>
                  <option value="Consultant">Nhân viên tư vấn</option>
                  <option value="Admin">Quản trị viên</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Chi nhánh</Form.Label>
                  <select
                    id="branchSelect"
                    value={selectedBranch}
                    onChange={handleBranchChange}
                    required
                >
                  <option value="">-- Chọn chi nhánh --</option>
                    {branches.map((b, idx) => (
                  <option key={idx} value={b.branch_name}>
                    {b.branch_name}
                  </option>
                  ))}
                  </select>
                
              </Form.Group>
            </Col>
          </Row>

          <div className="text-end">
            <Button variant="success" type="submit">
              THÊM NHÂN VIÊN
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default AddNewEmployee;
