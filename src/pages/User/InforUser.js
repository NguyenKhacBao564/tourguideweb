import React from 'react';
import Navbar from '../../layouts/Navbar';
import Footer from '../../layouts/Footer';
import "../../styles/pages/InforUser.scss"
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link } from 'react-router-dom';
import UserAvatar from '../../components/UserAvatar/UserAvatar';
import { FaArrowLeft } from "react-icons/fa6";
function InforUser(props) {
    return (
        <div className='inforUser_page'>
            <Navbar/>
            <div className='container-infor'>
                <Link to="/" className="back-link">
                    <FaArrowLeft /> Quay lại trang chủ
                </Link>
                <h1 className="profile-title">Hồ sơ của tôi</h1>
                
                <Container className='profile-container'>
                    <Row>
                        <Col md={8}>
                            <Form className="user-form">
                                <Form.Group className="mb-4" controlId="fullName">
                                    <Form.Label>Họ và tên</Form.Label>
                                    <Form.Control type="text" defaultValue="Nguyễn Khắc Bảo" />
                                </Form.Group>
                                
                                <Form.Group className="mb-4" controlId="phone">
                                    <Form.Label>Số điện thoại</Form.Label>
                                    <Form.Control type="text" defaultValue="0778173589" />
                                </Form.Group>
                                
                                <Form.Group className="mb-4" controlId="email">
                                    <Form.Label>Địa chỉ email</Form.Label>
                                    <Form.Control type="email" defaultValue="NguyenKhacBao123@gmail.com" />
                                </Form.Group>
                                
                                <Form.Group className="mb-4" controlId="address">
                                    <Form.Label>Địa chỉ</Form.Label>
                                    <Form.Control type="text" defaultValue="Số nhà 277, ấp 5 xã Mỹ Tho, huyện Cao Lãnh, tỉnh Đồng Tháp" />
                                </Form.Group>
                                
                                <Form.Group className="mb-4" controlId="password">
                                    <Form.Label>Mật khẩu</Form.Label>
                                    <Form.Control type="password" defaultValue="**************" />
                                </Form.Group>
                                
                                <Button variant="outline-warning" className="update-btn">
                                    Lưu cập nhật
                                </Button>
                            </Form>
                        </Col>
                        <Col md={4} className="avatar-section">
                            <div className="avatar-container">
                                <UserAvatar  image="logo.png" size="180px"/>
                                <div className="avatar-update">
                                    <Button variant="light">Chọn ảnh</Button>
                                    <p>Drag photo here</p>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
                
                <div className="text-end mt-5 mb-5">
                    <Button variant="danger" className="logout-btn">
                        Đăng xuất
                    </Button>
                </div>
            </div>
            <Footer/>
        </div>
    );
}

export default InforUser;