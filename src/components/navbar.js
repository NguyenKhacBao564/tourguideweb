import React from 'react';
import { Routes, Route, Link } from "react-router-dom";
import Contact from '../pages/Contact';
function Navbar() {
    return (
        <div className="navbar">
            <h1 className="logo">Tour Guide</h1>
            
            <ul className="links">
                <li><a href="#">About us</a></li>
                <li><a href="#">Popular Destination</a></li>
                <li><a href="#">Contact</a></li>
                <li><a href="#">Help</a></li>
            </ul>

            <ul className="auth-buttons">
                <li><Link to="/login" className="btn btn--login">Sign in</Link></li>
                <li><Link to="/register" className="btn btn--signup">Sign Up</Link></li>
            </ul>
          
        </div>
    );
}

export default Navbar;
