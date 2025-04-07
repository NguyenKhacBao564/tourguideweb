import React from 'react';
import { Container, Table, Button, Row, Col } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import SlideBarAdmin from '../../../components/Slidebar_Admin/SlideBarAdmin';
import NavBarAdmin from '../../../components/NavBar_Admin/NavBarAdmin';
import { BrowserRouter as Router, Routes, Route, Outlet} from "react-router-dom";
import "../../../styles/pages/Employee_Bussiness.scss";
function Employee_Business(props) {

 
  // const isActive = location.pathname === "/admin/nhanvien";

  return (
    <Container fluid style={{ minHeight: '100vh' }}>
      <Row className='p-0 ' style={{ minHeight: '100vh' }}>
        {/* Sidebar */}
        <Col xs={2} className="p-0" style={{zIndex: 0}}>
          <SlideBarAdmin />
        </Col>

        {/* Nội dung chính */}
        <Col xs={10}  className="EB__content  p-0">
          {/* Hàng 1: Header */}
          <div className="EB__header-content">
            <NavBarAdmin />
          </div>
          {/* Hàng 2: Nội dung chính */}
          <div className="admin-content">
            <Outlet />
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Employee_Business;