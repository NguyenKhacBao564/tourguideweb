import React, { useState } from 'react';
import { Routes, Route, Link } from "react-router-dom";
import Contact from '../pages/Contact';
import { FaBars, FaTimes} from "react-icons/fa";
function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="navbar">
            <h1 className="logo">Tour Guide</h1>
            <ul className={`nav-links ${isOpen ? "active" : ""}`}>
                <li className="btn--close" onClick={() => setIsOpen(!isOpen)}><FaTimes /></li>
                <li><a href="#">About us</a></li>
                <li><a href="#">Popular Destination</a></li>
                <li><a href="#">Contact</a></li>
                <li><a href="#">Help</a></li>
                <li><Link to="/register" className="btn btn--signup">Đăng kí</Link></li>
                <li><Link to="/login" className="btn btn--login">Đăng nhập</Link></li>
            </ul>

            <div className="menu-toggle" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <FaTimes /> : <FaBars />}
            </div>
          
        </div>
    );
}

export default Navbar;
