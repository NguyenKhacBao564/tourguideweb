// src/pages/User/BookingInfo.js
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col, Card, InputGroup } from "react-bootstrap";
import { FaMapMarkerAlt, FaCalendarAlt, FaUser, FaUsers, FaBaby } from "react-icons/fa";
import NavBar from '../../layouts/Navbar';
import "../../styles/pages/BookingInfo.scss";

const defaultPassenger = (type) => ({
  type, // 'adult', 'child', 'baby'
  fullname: "",
  gender: "",
  dob: "",
});

const BookingInfo = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Lấy dữ liệu tour từ location.state hoặc context
  const tour = location.state?.tour || {
    name: "Du lịch Đà Lạt - Samten Hills - Puppy Farm - Langbiang - Gallery La Chocotea - Thác Bobla",
    start: "TP. HCM",
    code: "43210",
    date: "24/03/2025",
    returnDate: "24/03/2025",
    priceAdult: 4390000,
    priceChild: 3990000,
    priceBaby: 0,
    image: "https://via.placeholder.com/300x200"
  };

  // State cho form
  const [contact, setContact] = useState({ 
    fullname: "", 
    phone: "", 
    email: "", 
    address: "" 
  });
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(1);
  const [babies, setBabies] = useState(0);
  const [passengers, setPassengers] = useState([
    { ...defaultPassenger("adult") },
    { ...defaultPassenger("child") }
  ]);
  const [payment, setPayment] = useState("bank");
  const [agree, setAgree] = useState(false);

  // Tính tổng tiền
  const total = adults * tour.priceAdult + children * tour.priceChild + babies * tour.priceBaby;

  // Xử lý tăng/giảm số lượng hành khách
  const handleChangeCount = (type, delta) => {
    let count, setCount, label;
    if (type === "adult") { count = adults; setCount = setAdults; label = "adult"; }
    if (type === "child") { count = children; setCount = setChildren; label = "child"; }
    if (type === "baby") { count = babies; setCount = setBabies; label = "baby"; }
    
    const newCount = count + delta;
    if (newCount < 0) return;
    if (type === "adult" && newCount < 1) return; // Ít nhất 1 người lớn
    
    setCount(newCount);

    // Cập nhật mảng passengers
    setPassengers(prev => {
      const filtered = prev.filter(p => p.type !== type);
      const newArr = Array(newCount).fill(0).map(() => defaultPassenger(type));
      return [...filtered, ...newArr];
    });
  };

  // Xử lý submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!agree) {
      alert("Bạn phải đồng ý với các điều khoản!");
      return;
    }
    
    // Tạo booking code
    const bookingCode = `${Date.now().toString().slice(-8)}VPHXB`;
    
    navigate("/checkout", {
      state: {
        contact,
        passengers,
        tour,
        total,
        payment,
        bookingCode,
        bookingDate: new Date().toLocaleString('vi-VN')
      }
    });
  };

  return (
    <div style={{background: '#f7f8fa', minHeight: '100vh'}}>
      <NavBar />
      <div className="container py-4">
        {/* Breadcrumb */}
        <div className="mb-3">
          <a href="/" style={{color: '#666', textDecoration: 'none', fontSize: 14}}>
            ← Quay lại
          </a>
        </div>
        
        <h2 className="text-center mb-4" style={{fontWeight: 700, color: "#1a237e", letterSpacing: 1}}>
          NHẬP THÔNG TIN
        </h2>
        
        <Row>
          <Col lg={8}>
            <Form onSubmit={handleSubmit}>
              {/* Thông tin liên lạc */}
              <Card className="mb-4 shadow-sm booking-card">
                <Card.Header>
                  <h5 className="mb-0 section-title">THÔNG TIN LIÊN LẠC</h5>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6} className="mb-3">
                      <Form.Group>
                        <Form.Label className="form-label">Họ tên *</Form.Label>
                        <Form.Control 
                          required 
                          value={contact.fullname} 
                          onChange={e => setContact({ ...contact, fullname: e.target.value })}
                          placeholder="Nhập họ tên"
                          className="form-input"
                        />
                        <div className="validation-text">Thông tin bắt buộc</div>
                      </Form.Group>
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Group>
                        <Form.Label className="form-label">Điện thoại *</Form.Label>
                        <Form.Control 
                          required 
                          value={contact.phone} 
                          onChange={e => setContact({ ...contact, phone: e.target.value })}
                          placeholder="Nhập số điện thoại"
                          className="form-input"
                        />
                        <div className="validation-text">Thông tin bắt buộc</div>
                      </Form.Group>
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Group>
                        <Form.Label className="form-label">Email *</Form.Label>
                        <Form.Control 
                          required 
                          type="email" 
                          value={contact.email} 
                          onChange={e => setContact({ ...contact, email: e.target.value })}
                          placeholder="Nhập email"
                          className="form-input"
                        />
                        <div className="validation-text">Thông tin bắt buộc</div>
                      </Form.Group>
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Group>
                        <Form.Label className="form-label">Địa chỉ *</Form.Label>
                        <Form.Control 
                          required 
                          value={contact.address} 
                          onChange={e => setContact({ ...contact, address: e.target.value })}
                          placeholder="Nhập địa chỉ"
                          className="form-input"
                        />
                        <div className="validation-text">Thông tin bắt buộc</div>
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* Hành khách */}
              <Card className="mb-4 shadow-sm booking-card">
                <Card.Header>
                  <h5 className="mb-0 section-title">HÀNH KHÁCH</h5>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={4} className="mb-3">
                      <div className="passenger-type">
                        <FaUser className="passenger-icon" />
                        <div>
                          <div className="passenger-label">Người lớn</div>
                          <div className="passenger-age">(Từ 12 tuổi trở lên)</div>
                        </div>
                        <div className="counter-group">
                          <Button 
                            variant="outline-secondary" 
                            size="sm"
                            onClick={() => handleChangeCount("adult", -1)}
                            disabled={adults <= 1}
                            className="counter-btn"
                          >
                            −
                          </Button>
                          <span className="counter-value">{adults}</span>
                          <Button 
                            variant="outline-secondary" 
                            size="sm"
                            onClick={() => handleChangeCount("adult", 1)}
                            className="counter-btn"
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    </Col>
                    <Col md={4} className="mb-3">
                      <div className="passenger-type">
                        <FaUsers className="passenger-icon" />
                        <div>
                          <div className="passenger-label">Trẻ em</div>
                          <div className="passenger-age">(Từ 4 - 11 tuổi)</div>
                        </div>
                        <div className="counter-group">
                          <Button 
                            variant="outline-secondary" 
                            size="sm"
                            onClick={() => handleChangeCount("child", -1)}
                            className="counter-btn"
                          >
                            −
                          </Button>
                          <span className="counter-value">{children}</span>
                          <Button 
                            variant="outline-secondary" 
                            size="sm"
                            onClick={() => handleChangeCount("child", 1)}
                            className="counter-btn"
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    </Col>
                    <Col md={4} className="mb-3">
                      <div className="passenger-type">
                        <FaBaby className="passenger-icon" />
                        <div>
                          <div className="passenger-label">Em bé</div>
                          <div className="passenger-age">(Dưới 4 tuổi)</div>
                        </div>
                        <div className="counter-group">
                          <Button 
                            variant="outline-secondary" 
                            size="sm"
                            onClick={() => handleChangeCount("baby", -1)}
                            className="counter-btn"
                          >
                            −
                          </Button>
                          <span className="counter-value">{babies}</span>
                          <Button 
                            variant="outline-secondary" 
                            size="sm"
                            onClick={() => handleChangeCount("baby", 1)}
                            className="counter-btn"
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* Thông tin hành khách */}
              <Card className="mb-4 shadow-sm booking-card">
                <Card.Header>
                  <h5 className="mb-0 section-title">THÔNG TIN HÀNH KHÁCH</h5>
                </Card.Header>
                <Card.Body>
                  {passengers.map((p, idx) => {
                    const passengerLabel = p.type === 'adult' ? 'Người lớn' : p.type === 'child' ? 'Trẻ em' : 'Em bé';
                    const passengerIndex = passengers.filter((pass, i) => i <= idx && pass.type === p.type).length;
                    
                    return (
                      <div key={idx} className="passenger-form mb-4">
                        <div className="passenger-header">
                          <FaUser className="me-2" />
                          <span className="passenger-title">{passengerLabel} ({passengerIndex})</span>
                        </div>
                        <Row className="mt-3">
                          <Col md={4} className="mb-3">
                            <Form.Group>
                              <Form.Label className="form-label">Họ tên *</Form.Label>
                              <Form.Control 
                                required 
                                value={p.fullname} 
                                onChange={e => {
                                  const arr = [...passengers];
                                  arr[idx].fullname = e.target.value;
                                  setPassengers(arr);
                                }}
                                placeholder="Nhập họ tên"
                                className="form-input"
                              />
                              <div className="validation-text">Thông tin bắt buộc</div>
                            </Form.Group>
                          </Col>
                          <Col md={4} className="mb-3">
                            <Form.Group>
                              <Form.Label className="form-label">Giới tính *</Form.Label>
                              <Form.Select 
                                required 
                                value={p.gender} 
                                onChange={e => {
                                  const arr = [...passengers];
                                  arr[idx].gender = e.target.value;
                                  setPassengers(arr);
                                }}
                                className="form-input"
                              >
                                <option value="">Chọn giới tính</option>
                                <option value="Nam">Nam</option>
                                <option value="Nữ">Nữ</option>
                              </Form.Select>
                              <div className="validation-text">Thông tin bắt buộc</div>
                            </Form.Group>
                          </Col>
                          <Col md={4} className="mb-3">
                            <Form.Group>
                              <Form.Label className="form-label">Ngày sinh *</Form.Label>
                              <Form.Control 
                                required 
                                type="date" 
                                value={p.dob} 
                                onChange={e => {
                                  const arr = [...passengers];
                                  arr[idx].dob = e.target.value;
                                  setPassengers(arr);
                                }}
                                className="form-input"
                              />
                              <div className="validation-text">Thông tin bắt buộc</div>
                            </Form.Group>
                          </Col>
                        </Row>
                      </div>
                    );
                  })}
                </Card.Body>
              </Card>

              {/* Các hình thức thanh toán */}
              <Card className="mb-4 shadow-sm booking-card">
                <Card.Header>
                  <h5 className="mb-0 section-title">CÁC HÌNH THỨC THANH TOÁN</h5>
                </Card.Header>
                <Card.Body>
                  <div className="payment-options">
                    <Form.Check
                      type="radio"
                      id="payment-bank"
                      name="payment"
                      label="Chuyển khoản"
                      checked={payment === "bank"}
                      onChange={() => setPayment("bank")}
                      className="payment-option mb-3"
                    />
                    <Form.Check
                      type="radio"
                      id="payment-vnpay"
                      name="payment"
                      label={
                        <span>
                          Thanh toán bằng VNPAY 
                          <img src="https://via.placeholder.com/40x20/1a237e/white?text=VNP" alt="VNPay" className="ms-2" style={{height: '20px'}} />
                        </span>
                      }
                      checked={payment === "vnpay"}
                      onChange={() => setPayment("vnpay")}
                      className="payment-option mb-3"
                    />
                    <Form.Check
                      type="radio"
                      id="payment-momo"
                      name="payment"
                      label={
                        <span>
                          Thanh toán bằng MoMo 
                          <img src="https://via.placeholder.com/40x20/d82d8b/white?text=MOMO" alt="MoMo" className="ms-2" style={{height: '20px'}} />
                        </span>
                      }
                      checked={payment === "momo"}
                      onChange={() => setPayment("momo")}
                      className="payment-option mb-3"
                    />
                  </div>
                </Card.Body>
              </Card>

              {/* Điều khoản */}
              <Card className="mb-4 shadow-sm booking-card">
                <Card.Header>
                  <h5 className="mb-0 section-title">Điều khoản bắt buộc khi đăng ký online</h5>
                </Card.Header>
                <Card.Body>
                  <div className="terms-content mb-3">
                    <h6 className="terms-subtitle">ĐIỀU KHOẢN THỎA THUẬN SỬ DỤNG DỊCH VỤ DU LỊCH HỢI DIA</h6>
                    <p className="terms-text">
                      Quý khách khi đặt chỗ đã được biết đó là chỗ, phòng số đó hay những ý định cần thiết, vì vậy Quý khách gần như không được thay đổi phòng trên chỗ phiên bản hiện tại khi sắp ra đi đây vào mồng chỗ sửa thành phần đó khi làm.
                    </p>
                    <p className="terms-text">
                      Nội dung đảm bảo giữa và đối với:
                    </p>
                    <ul className="terms-list">
                      <li>Phần 1: Điều khoản loại về các chương trình du lịch này</li>
                      <li>Phần 2: Chức năng điều khoản điền đầy đủ hay tên</li>
                      <li>Có khi đó dùng hiểu như mà</li>
                    </ul>
                    <p className="terms-footer">
                      <strong>PHẢN ỨNG ĐIỀU KIỆN VỀ CÁC CHƯƠNG TRÌNH DU LỊCH HỢI ĐIA</strong>
                    </p>
                    <p className="terms-footer">
                      <strong>1. GỢI Ý DU LỊCH</strong>
                    </p>
                    <p className="terms-text">
                      Gói dịch vụ du lịch được đặt hỗ trợ thông qua không phiết chăm sóc khách hàng của Vietnamworks tác: Du lịch được thông tri vào nhiều hứa Hà khẩu trong phuỗi chế hết cảnh đó.
                    </p>
                  </div>
                  <Form.Group>
                    <Form.Check
                      type="checkbox"
                      id="agree-terms"
                      label={
                        <span>
                          Tôi đồng ý với{' '}
                          <a href="#" className="terms-link">Chính sách</a>
                          {' '}bảo vệ dữ liệu cá nhân và các{' '}
                          <a href="#" className="terms-link">điều khoản trên</a>.
                        </span>
                      }
                      checked={agree}
                      onChange={e => setAgree(e.target.checked)}
                      required
                      className="terms-checkbox"
                    />
                  </Form.Group>
                </Card.Body>
              </Card>
            </Form>
          </Col>

          {/* Sidebar - Phiếu xác nhận booking */}
          <Col lg={4}>
            <Card className="booking-summary shadow-sm sticky-top">
              <Card.Header className="summary-header">
                <h5 className="mb-0">PHIẾU XÁC NHẬN BOOKING</h5>
              </Card.Header>
              <Card.Body>
                <div className="tour-summary mb-3">
                  <div className="tour-image mb-3">
                    <img src={tour.image} alt={tour.name} className="img-fluid rounded" />
                  </div>
                  <h6 className="tour-name">{tour.name}</h6>
                  <div className="tour-details">
                    <div className="detail-item">
                      <span className="detail-label">Mã tour:</span>
                      <span className="detail-value text-danger fw-bold">{tour.code}</span>
                    </div>
                  </div>
                </div>

                <div className="trip-info mb-3">
                  <h6 className="info-title">THÔNG TIN TOUR:</h6>
                  <Row className="info-grid">
                    <Col xs={6} className="info-item">
                      <FaCalendarAlt className="info-icon" />
                      <div>
                        <div className="info-label">Ngày đi:</div>
                        <div className="info-value">{tour.date}</div>
                      </div>
                    </Col>
                    <Col xs={6} className="info-item">
                      <FaCalendarAlt className="info-icon" />
                      <div>
                        <div className="info-label">Ngày về:</div>
                        <div className="info-value">{tour.returnDate}</div>
                      </div>
                    </Col>
                    <Col xs={6} className="info-item">
                      <FaMapMarkerAlt className="info-icon" />
                      <div>
                        <div className="info-label">Nơi khởi hành:</div>
                        <div className="info-value">{tour.start}</div>
                      </div>
                    </Col>
                    <Col xs={6} className="info-item">
                      <FaMapMarkerAlt className="info-icon" />
                      <div>
                        <div className="info-label">Xe khách</div>
                      </div>
                    </Col>
                  </Row>
                </div>

                <div className="pricing-summary mb-3">
                  <h6 className="info-title">KHÁCH HÀNG</h6>
                  <div className="price-breakdown">
                    <div className="price-item">
                      <span>Người lớn</span>
                      <span>{adults} x {tour.priceAdult.toLocaleString()} đ</span>
                    </div>
                    <div className="price-item">
                      <span>Trẻ em</span>
                      <span>{children} x {tour.priceChild.toLocaleString()} đ</span>
                    </div>
                    <div className="price-item">
                      <span>Em bé</span>
                      <span>{babies} x {tour.priceBaby.toLocaleString()} đ</span>
                    </div>
                  </div>
                </div>

                <div className="price-total mb-3">
                  <div className="total-label">Tổng tiền:</div>
                  <div className="total-amount">{total.toLocaleString()} đ</div>
                </div>

                <Button 
                  type="submit" 
                  variant="danger" 
                  size="lg" 
                  className="w-100 book-now-btn"
                  onClick={handleSubmit}
                  disabled={!agree}
                >
                  Đặt ngay
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default BookingInfo;