import React, { useState, useEffect} from 'react';
import { Link } from "react-router-dom";
import "../styles/layouts/Navbar.scss";
import { FaBars, FaTimes} from "react-icons/fa";
import UserAvatar from '../components/Common/UserAvatar/UserAvatar';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useLocation } from "react-router-dom";
import { API_URL } from '../utils/API_Port';
import Spinner from 'react-bootstrap/Spinner';

function Navbar({ bookingPageRef }) {
    const { user, loading } = useContext(AuthContext);

    // State to manage the open/close state of the navbar (mobile view)
    const [isOpen, setIsOpen] = useState(false);
    
    // Kiểm tra xem có phải trang chủ không, nếu không thì sẽ áp dung style not-home
    const location = useLocation();
    const isHomePage = location.pathname === "/";
    
    const[isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
    // Function to handle scroll event and change navbar style
        const handleScroll = () => {
           if (bookingPageRef?.current) {
                // Kiểm tra vị trí cuộn của .bookingPage
                if (bookingPageRef.current.scrollTop > 0) {
                    setIsScrolled(true);
                } else {
                    setIsScrolled(false);
                }
            } else {
                // Dự phòng cho các trang khác sử dụng window.scrollY
                if (window.scrollY > 0) {
                setIsScrolled(true);
                } else {
                setIsScrolled(false);
                }
      }
        };
        // Thêm sự kiện cuộn cho .bookingPage hoặc window
        const scrollElement = bookingPageRef?.current || window;
        scrollElement.addEventListener("scroll", handleScroll);
        
        return () => {
            window.removeEventListener("scroll", handleScroll);
        }
   
    },[bookingPageRef]);


    return (
        <div className={`navbar ${isScrolled ? "scrolled" : ""} ${!isHomePage ? "not-home" : ""}`}>
            <div className="navbar-content">
                <h1 className="logo"><Link to="/">Tour Guide</Link></h1>
                <ul className={`nav-links ${isOpen ? "active" : ""}`}>
                    <li className="btn--close" onClick={() => setIsOpen(!isOpen)}><FaTimes /></li>
                    <li><a href="#">About us</a></li>
                    <li><a href="#">Popular Destination</a></li>
                    <li><Link to="/contact">Contact Us</Link></li>
                    <li><a href="#">Help</a></li>
                    {!user && loading ? (
                        <li className="auth-loading">
                            <Spinner animation="border" size="sm" role="status">
                                <span className="visually-hidden">Đang tải...</span>
                            </Spinner>
                        </li>
                    ) : !user ? (
                        <>
                            <li><Link to="/register" className="btn btn--signup">Đăng kí</Link></li>
                            <li><Link to="/login" className="btn btn--login">Đăng nhập</Link></li>
                        </>
                    ) : (
                        <>
                            <li>
                                <Link to="/thongtin">
                                <UserAvatar name={user.name} image={user.avatar} size="50px"/>
                                </Link>
                            </li>
                        </>
                    )}
                </ul>

                <div className="menu-toggle" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <FaTimes /> : <FaBars />}
                </div>
            </div>
        </div>
    );
}

export default Navbar;
