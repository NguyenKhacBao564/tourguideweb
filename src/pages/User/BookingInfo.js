// src/pages/User/BookingInfo.js
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col, Card, InputGroup } from "react-bootstrap";

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
    name: "Du lịch Đà Lạt - Samten Hills ...",
    start: "TP. HCM",
    code: "43210",
    date: "24/03/2025",
    priceAdult: 4390000,
    priceChild: 1990000,
    priceBaby: 0,
    image: "https://your-image-url.jpg"
  };

  // State cho form
  const [contact, setContact] = useState({ fullname: "", phone: "", email: "", address: "" });
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
    if (count + delta < 0) return;
    setCount(count + delta);

    // Cập nhật mảng passengers
    setPassengers(prev => {
      const filtered = prev.filter(p => p.type !== type);
      const newArr = Array(count + delta).fill(0).map(() => defaultPassenger(type));
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
    navigate("/checkout", {
      state: {
        contact,
        passengers,
        tour,
        total,
        payment
      }
    });
  };

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4" style={{fontWeight: 700, color: "#1a237e"}}>NHẬP THÔNG TIN</h2>
      <Row>
        <Col md={8}>
          <Form onSubmit={handleSubmit}>
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>THÔNG TIN LIÊN LẠC</Card.Title>
                <Row>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Họ tên *</Form.Label>
                      <Form.Control required value={contact.fullname} onChange={e => setContact({ ...contact, fullname: e.target.value })} />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Điện thoại *</Form.Label>
                      <Form.Control required value={contact.phone} onChange={e => setContact({ ...contact, phone: e.target.value })} />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Email *</Form.Label>
                      <Form.Control required type="email" value={contact.email} onChange={e => setContact({ ...contact, email: e.target.value })} />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Địa chỉ *</Form.Label>
                      <Form.Control required value={contact.address} onChange={e => setContact({ ...contact, address: e.target.value })} />
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>HÀNH KHÁCH</Card.Title>
                <Row>
                  <Col md={4}>
                    <div>Người lớn</div>
                    <InputGroup>
                      <Button variant="outline-secondary" onClick={() => handleChangeCount("adult", -1)}>-</Button>
                      <Form.Control value={adults} readOnly style={{width: 40, textAlign: "center"}} />
                      <Button variant="outline-secondary" onClick={() => handleChangeCount("adult", 1)}>+</Button>
                    </InputGroup>
                  </Col>
                  <Col md={4}>
                    <div>Trẻ em</div>
                    <InputGroup>
                      <Button variant="outline-secondary" onClick={() => handleChangeCount("child", -1)}>-</Button>
                      <Form.Control value={children} readOnly style={{width: 40, textAlign: "center"}} />
                      <Button variant="outline-secondary" onClick={() => handleChangeCount("child", 1)}>+</Button>
                    </InputGroup>
                  </Col>
                  <Col md={4}>
                    <div>Em bé</div>
                    <InputGroup>
                      <Button variant="outline-secondary" onClick={() => handleChangeCount("baby", -1)}>-</Button>
                      <Form.Control value={babies} readOnly style={{width: 40, textAlign: "center"}} />
                      <Button variant="outline-secondary" onClick={() => handleChangeCount("baby", 1)}>+</Button>
                    </InputGroup>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>THÔNG TIN HÀNH KHÁCH</Card.Title>
                {passengers.map((p, idx) => (
                  <Row key={idx} className="mb-2">
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>Họ tên *</Form.Label>
                        <Form.Control required value={p.fullname} onChange={e => {
                          const arr = [...passengers];
                          arr[idx].fullname = e.target.value;
                          setPassengers(arr);
                        }} />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>Giới tính *</Form.Label>
                        <Form.Select required value={p.gender} onChange={e => {
                          const arr = [...passengers];
                          arr[idx].gender = e.target.value;
                          setPassengers(arr);
                        }}>
                          <option value="">Chọn</option>
                          <option value="Nam">Nam</option>
                          <option value="Nữ">Nữ</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>Ngày sinh *</Form.Label>
                        <Form.Control required type="date" value={p.dob} onChange={e => {
                          const arr = [...passengers];
                          arr[idx].dob = e.target.value;
                          setPassengers(arr);
                        }} />
                      </Form.Group>
                    </Col>
                  </Row>
                ))}
              </Card.Body>
            </Card>
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>CÁC HÌNH THỨC THANH TOÁN</Card.Title>
                <Form.Check
                  type="radio"
                  label="Chuyển khoản"
                  checked={payment === "bank"}
                  onChange={() => setPayment("bank")}
                />
                <Form.Check
                  type="radio"
                  label="Thanh toán bằng VNPAY"
                  checked={payment === "vnpay"}
                  onChange={() => setPayment("vnpay")}
                />
                <Form.Check
                  type="radio"
                  label="Thanh toán bằng MoMo"
                  checked={payment === "momo"}
                  onChange={() => setPayment("momo")}
                />
              </Card.Body>
            </Card>
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>Điều khoản bắt buộc khi đăng ký online</Card.Title>
                <Form.Group>
                  <Form.Check
                    type="checkbox"
                    label={<span>Tôi đồng ý với <a href="#">Chính sách</a> bảo vệ dữ liệu cá nhân và các <a href="#">điều khoản trên</a>.</span>}
                    checked={agree}
                    onChange={e => setAgree(e.target.checked)}
                    required
                  />
                </Form.Group>
              </Card.Body>
            </Card>
            <Button type="submit" variant="danger" size="lg" className="w-100">Đặt ngay</Button>
          </Form>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Img variant="top" src={tour.image} />
            <Card.Body>
              <Card.Title>{tour.name}</Card.Title>
              <div>Mã tour: <b>{tour.code}</b></div>
              <div>Khởi hành: {tour.start}</div>
              <div>Ngày đi: {tour.date}</div>
              <hr />
              <div><b>KHÁCH HÀNG:</b></div>
              <div>Người lớn: {adults} x {tour.priceAdult.toLocaleString()} đ</div>
              <div>Trẻ em: {children} x {tour.priceChild.toLocaleString()} đ</div>
              <div>Em bé: {babies} x {tour.priceBaby.toLocaleString()} đ</div>
              <hr />
              <div className="d-flex justify-content-between align-items-center">
                <span><b>Tổng tiền:</b></span>
                <span style={{color: "red", fontWeight: 700, fontSize: 20}}>{total.toLocaleString()} đ</span>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default BookingInfo;