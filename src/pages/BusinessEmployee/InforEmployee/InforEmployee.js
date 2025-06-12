import React from 'react';
import './InforEmployee.scss'; // Import your styles here
import { Container, Row, Col } from 'react-bootstrap'; // Assuming you're using react-bootstrap for layout
import Form from 'react-bootstrap/Form'; // Import Form component if needed
import Button from 'react-bootstrap/Button'; // Import Button component if needed

function InforEmployee(props) {
    return (
        <div className="infor-employee-container">
            <Container>
                <Row className="mb-4">
                    <Col>
                        <h2>Thông tin nhân viên</h2>
                    </Col>
                </Row>
                <Row>
                    <Col md={2}>
                        <h3>Ảnh đại diện</h3>
                        <img src="" alt="Avatar" className="employee-avatar" />
                    </Col>
                    <Col >
                        <Form>
                            <Form.Group controlId="formFullName">
                                <Form.Label>Họ và tên</Form.Label>
                                <Form.Control type="text" placeholder="Nhập họ và tên" value="Phạm Phúc Duy" readOnly disabled />
                            </Form.Group>

                            <Form.Group controlId="formEmail">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" placeholder="Nhập email" value="NguyenKhacBao123@gmail.com" readOnly disabled />
                            </Form.Group>

                            <Form.Group controlId="formRole">
                                <Form.Label>Vai trò</Form.Label>
                                <Form.Control type="text" placeholder="Nhập vai trò" value="test" readOnly disabled />
                            </Form.Group>
                        </Form>
                    </Col>
                    <Col>
                     <Form>
                            <Form.Group controlId="formPhone">
                                <Form.Label>Số điện thoại</Form.Label>
                                <Form.Control type="text" placeholder="Nhập số điện thoại" value="test" readOnly disabled />
                            </Form.Group>
                            <Form.Group controlId="formAddress">
                                <Form.Label>Địa chỉ</Form.Label>
                                <Form.Control type="text" placeholder="Nhập địa chỉ" value="test" readOnly disabled />
                            </Form.Group>

                            <Form.Group controlId="formBranch">
                                <Form.Label>Chi nhánh</Form.Label>
                                <Form.Control type="text" placeholder="Nhập chi nhánh" value="test" readOnly disabled />
                            </Form.Group>

                            <Button variant="danger" className="btn btn-primary mt-3">Đăng xuất</Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default InforEmployee;