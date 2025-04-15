import React, { useState, useEffect, use } from 'react';
import { Link } from "react-router-dom";
import "../styles/layouts/Navbar.scss";
import { FaBars, FaTimes} from "react-icons/fa";
import UserAvatar from '../components/UserAvatar/UserAvatar';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, useLocation } from "react-router-dom";

function Navbar() {
    const { user, logout } = useContext(AuthContext);
    // State to manage the open/close state of the navbar (mobile view)
    const [isOpen, setIsOpen] = useState(false);
    
    // Kiểm tra xem có phải trang chủ không, nếu không thì sẽ áp dung style not-home
    const location = useLocation();
    const isHomePage = location.pathname === "/";
    
    const[isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
    // Function to handle scroll event and change navbar style
        const handleScroll = () => {
            if (window.scrollY > 0) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        
        return () => {
            window.removeEventListener("scroll", handleScroll);
        }
   
    },[]);


    return (
        <div className={`navbar ${isScrolled ? "scrolled" : ""} ${!isHomePage ? "not-home" : ""}`}>
            <div className="navbar-content">
                <h1 className="logo">Tour Guide</h1>
                <ul className={`nav-links ${isOpen ? "active" : ""}`}>
                    <li className="btn--close" onClick={() => setIsOpen(!isOpen)}><FaTimes /></li>
                    <li><a href="#">About us</a></li>
                    <li><a href="#">Popular Destination</a></li>
                    <li><a href="/contact">Contact</a></li>
                    <li><a href="#">Help</a></li>
                    {!user && (
                        <>
                            <li><Link to="/register" className="btn btn--signup">Đăng kí</Link></li>
                            <li><Link to="/login" className="btn btn--login">Đăng nhập</Link></li>
                        </>
                    )}
                    {user && (
                        <>
                            <li><Link to="/thongtin"><UserAvatar name={user.name} image="avatar.jpg" size="50px"/></Link></li>
                            <li><button className="btn btn--login" onClick={logout}>Đăng xuất</button></li>
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
