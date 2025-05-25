import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, Button, Row, Col } from "react-bootstrap";
import { FaChevronDown, FaCalendarAlt, FaMapMarkerAlt, FaBus } from "react-icons/fa";
import NavBar from '../../layouts/Navbar';
import "../../styles/pages/Checkout.scss";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Lấy dữ liệu từ location.state
  const {
    contact = {},
    passengers = [],
    tour = {},
    total = 0,
    payment = "",
    bookingCode = "2503125VPHXB",
    status = "Chưa thanh toán",
    bookingDate = "12/3/2025 10:50",
    paymentDeadline = "13/03/2025 10:50"
  } = location.state || {};

  return (
    <div style={{background: '#f7f8fa', minHeight: '100vh'}}>
      <NavBar />
      <div className="container py-4">
        <a href="/" style={{color: '#222', fontWeight: 500, textDecoration: 'none', fontSize: 16}}>&larr; Quay lại trang chủ</a>
        <h2 className="text-center mb-4" style={{fontWeight: 700, color: "#1a237e", letterSpacing: 1}}>THANH TOÁN</h2>
        <Row>
          <Col md={7}>
            {/* Thông tin liên lạc */}
            <Card className="mb-3 shadow-sm" style={{borderRadius: 12, border: 'none'}}>
              <Card.Header style={{background: '#f3f4f6', fontWeight: 700, color: '#1a237e', borderTopLeftRadius: 12, borderTopRightRadius: 12, fontSize: 16}}>THÔNG TIN LIÊN LẠC</Card.Header>
              <Card.Body style={{background: '#fafbfc'}}>
                <Row className="mb-2">
                  <Col md={4}><b>Họ tên</b><div>{contact.fullname}</div></Col>
                  <Col md={4}><b>Email</b><div>{contact.email}</div></Col>
                  <Col md={4}><b>Điện thoại</b><div>{contact.phone}</div></Col>
                </Row>
                <Row>
                  <Col md={12}><b>Địa chỉ</b><div>{contact.address}</div></Col>
                </Row>
              </Card.Body>
            </Card>
            {/* Chi tiết booking */}
            <Card className="mb-3 shadow-sm" style={{borderRadius: 12, border: 'none'}}>
              <Card.Header style={{background: '#f3f4f6', fontWeight: 700, color: '#1a237e', borderTopLeftRadius: 12, borderTopRightRadius: 12, fontSize: 16}}>CHI TIẾT BOOKING</Card.Header>
              <Card.Body style={{background: '#fafbfc'}}>
                <Row className="mb-2">
                  <Col md={6}><b>Mã đặt chỗ:</b> <span style={{color: "#e53935", fontWeight: 700}}>{bookingCode}</span></Col>
                  <Col md={6}><b>Ngày tạo:</b> {bookingDate}</Col>
                </Row>
                <Row className="mb-2">
                  <Col md={6}><b>Trị giá Booking:</b> <span style={{color: '#e53935', fontWeight: 700}}>{total.toLocaleString()} đ</span></Col>
                  <Col md={6}><b>Hình thức thanh toán:</b> {payment === "bank" ? "Chuyển khoản ngân hàng" : payment === "vnpay" ? "VNPAY" : "MoMo"}</Col>
                </Row>
                <Row className="mb-2">
                  <Col md={6}><b>Tình trạng:</b> {status}</Col>
                  <Col md={6}><b>Thời hạn thanh toán:</b> {paymentDeadline}</Col>
                </Row>
              </Card.Body>
            </Card>
            {/* Danh sách hành khách */}
            <Card className="mb-3 shadow-sm" style={{borderRadius: 12, border: 'none'}}>
              <Card.Header style={{background: '#f3f4f6', fontWeight: 700, color: '#1a237e', borderTopLeftRadius: 12, borderTopRightRadius: 12, fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                DANH SÁCH HÀNH KHÁCH
                <FaChevronDown style={{fontSize: 18}} />
              </Card.Header>
              <Card.Body style={{background: '#fafbfc', paddingBottom: 8}}>
                <div style={{maxHeight: 180, overflowY: 'auto'}}>
                  <Row style={{fontWeight: 600, color: '#222', borderBottom: '1px solid #e0e0e0', marginBottom: 4, fontSize: 15}}>
                    <Col md={4}>Họ tên</Col>
                    <Col md={3}>Ngày sinh</Col>
                    <Col md={3}>Giới tính</Col>
                    <Col md={2}>Độ tuổi</Col>
                  </Row>
                  {passengers.map((p, idx) => (
                    <Row key={idx} style={{fontSize: 15, borderBottom: '1px solid #f0f0f0', marginBottom: 2}}>
                      <Col md={4}>{p.fullname}</Col>
                      <Col md={3}>{p.dob}</Col>
                      <Col md={3}>{p.gender}</Col>
                      <Col md={2}>{p.dob ? (new Date().getFullYear() - new Date(p.dob).getFullYear()) + " Tuổi" : ""}</Col>
                    </Row>
                  ))}
                </div>
                <div style={{textAlign: 'right', fontWeight: 700, color: '#e53935', fontSize: 18, marginTop: 8}}>
                  Tổng cộng: {total.toLocaleString()} đ
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={5}>
            <Card className="shadow-sm" style={{borderRadius: 12, border: 'none', background: '#f3f4f6'}}>
              <Card.Body>
                <div style={{fontWeight: 700, color: '#1a237e', fontSize: 16, marginBottom: 8, textTransform: 'uppercase'}}>PHIẾU XÁC NHẬN BOOKING</div>
                <div className="d-flex align-items-center mb-2">
                  <img src={tour.image} alt="tour" style={{width: 110, height: 80, objectFit: "cover", borderRadius: 8, marginRight: 12, border: '1px solid #e0e0e0'}} />
                  <div>
                    <div style={{fontWeight: 700, fontSize: 16, color: '#222'}}>{tour.name}</div>
                    <div style={{fontSize: 15}}>Mã tour: <span style={{color: "#e53935", fontWeight: 700}}>{tour.code}</span></div>
                    <div style={{fontSize: 15}}>Mã đặt chỗ: <span style={{color: "#e53935", fontWeight: 700}}>{bookingCode}</span></div>
                  </div>
                </div>
                <div style={{marginTop: 12, marginBottom: 8, fontWeight: 600, color: '#222'}}>THÔNG TIN TOUR:</div>
                <Row style={{fontSize: 15, color: '#444'}}>
                  <Col xs={6} className="mb-2"><FaCalendarAlt style={{marginRight: 6}}/> Ngày đi: <b>{tour.startDate || "20/03/2025"}</b></Col>
                  <Col xs={6} className="mb-2"><FaCalendarAlt style={{marginRight: 6}}/> Ngày về: <b>{tour.endDate || "24/03/2025"}</b></Col>
                  <Col xs={6} className="mb-2"><FaMapMarkerAlt style={{marginRight: 6}}/> {tour.start || "Đà Lạt"}</Col>
                  <Col xs={6} className="mb-2"><FaBus style={{marginRight: 6}}/> Xe khách</Col>
                </Row>
                <Button variant="danger" className="w-100 mt-4" size="lg" style={{fontWeight: 700, fontSize: 18, borderRadius: 8}}>Thanh toán ngay</Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Checkout;