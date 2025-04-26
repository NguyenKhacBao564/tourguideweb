import React, {useContext, useState} from 'react';
import Navbar from '../../layouts/Navbar';
import Footer from '../../layouts/Footer';
import "../../styles/pages/InforUser.scss"
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link } from 'react-router-dom';
import UserAvatar from '../../components/Common/UserAvatar/UserAvatar';
import { FaArrowLeft } from "react-icons/fa6";
import { AuthContext } from '../../context/AuthContext';
import Image from 'react-bootstrap/Image';

function InforUser(props) {
    const { user, logout } = useContext(AuthContext);
    const [image, setImage] = useState(null);
    const [displayImage, setDisplayImage] = useState(null);
    console.log("user infor:", user);
    
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            // Revoke previous URL to prevent memory leaks
            if (displayImage) {
                URL.revokeObjectURL(displayImage);
            }
            setDisplayImage(URL.createObjectURL(file));
        }
    }


    // If user is null or undefined, show a loading state
    if (!user) {
        return (
            <div className='inforUser_page'>
                <Navbar/>
                <div className='container-infor'>
                    <h1 className="profile-title">Thông tin người dùng không khả dụng</h1>
                    <Link to="/" className="back-link">
                        <FaArrowLeft /> Quay lại trang chủ
                    </Link>
                </div>
                <Footer/>
            </div>
        );
    }
    
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
                                    <Form.Control type="text" defaultValue={user.name || ''} />
                                </Form.Group>
                                
                                <Form.Group className="mb-4" controlId="phone">
                                    <Form.Label>Số điện thoại</Form.Label>
                                    <Form.Control type="text" defaultValue={user.phone || ''} />
                                </Form.Group>
                                
                                <Form.Group className="mb-4" controlId="email">
                                    <Form.Label>Địa chỉ email</Form.Label>
                                    <Form.Control type="email" defaultValue={user.email || ''} disabled/>
                                </Form.Group>
                                
                                <Form.Group className="mb-4" controlId="address">
                                    <Form.Label>Địa chỉ</Form.Label>
                                    <Form.Control type="text" defaultValue={user.address || ''} />
                                </Form.Group>
                                
                                <Button variant="outline-warning" className="update-btn">
                                    Lưu cập nhật
                                </Button>
                            </Form>
                        </Col>
                        <Col md={4} className="avatar-section">
                            <div className="avatar-container">
                                <div className="avatar-display">
                                    <Image src={displayImage || user.avatar || "default-avatar.jpg"} alt="avatar" className="avatar-image"/>
                                </div>
                                <div className="avatar-update">
                                    <Form.Control
                                        type="file"
                                        multiple = {false}
                                        className="d-none"
                                        id="imageUpload"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                    />
                                    <label htmlFor="imageUpload" className="btn-changeAvatar mt-2 p-2">
                                    Thay đổi ảnh
                                    </label>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
                
                <div className="text-end mt-5 mb-5">
                    <Button variant="danger" className="logout-btn" onClick={logout}>
                        Đăng xuất
                    </Button>
                </div>
            </div>
            <Footer/>
        </div>
    );
}

export default InforUser;