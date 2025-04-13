import React from "react";
import { Nav } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { FaUserLarge } from "react-icons/fa6";
import { BiCalendarCheck } from "react-icons/bi";
import { MdDiscount } from "react-icons/md";
import { IoLogOutSharp } from "react-icons/io5";
import "./SlideBar.scss";

function SidebarAdmin() {
    const navigate = useNavigate();
    const location = useLocation();

    return (
            <Nav  defaultActiveKey="/khach-hang" className="custom-nav flex-column">
                <div className="intro d-flex align-items-center justify-content-center">
                    <img src="/logo.png" alt="logo" className="slidebar-logo" />
                    <h1>Tour Guide</h1>
                </div>

                <Nav.Item 
                    className={`nav-item ${location.pathname === "/admin/khachhang" ? "active" : ""}`} 
                    onClick={() => navigate("/admin/khachhang")}
                    data-title="Khách hàng"
                >
                    <FaUserLarge />
                    <p>Khách hàng</p>
                </Nav.Item>

                <Nav.Item 
                    className={`nav-item ${location.pathname.startsWith("/admin/managetour") ? "active" : ""}`} 
                    onClick={() => navigate("/admin/managetour")}
                    data-title="Lịch đặt"
                >
                    <BiCalendarCheck />
                    <p>Lịch đặt</p>
                </Nav.Item>

                <Nav.Item 
                    className={`nav-iten ${location.pathname === "/admin/khuyenmai" ? "active" : ""}`} 
                    onClick={() => navigate("/admin/khuyenmai")}
                    data-title="Khuyến mãi"
                >
                    <MdDiscount />
                    <p>Khuyến mãi</p>
                </Nav.Item>

                <Nav.Item 
                    className="nav-item logout" 
                    onClick={() => navigate("/logout")}
                    data-title="Đăng xuất"
                >
                    <IoLogOutSharp />
                    <p>Đăng xuất</p>
                </Nav.Item>
            </Nav>
        
    );
}

export default SidebarAdmin;
