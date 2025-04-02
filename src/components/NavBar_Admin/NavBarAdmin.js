import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import "./NavBarAdmin.scss"

function NavBarAdmin(props) {
    return (
        <div className="navbar-admin">
            <h1 className='navbar-admin__title'>Nhân viên kinh doanh</h1>

            <div className='navbar-admin__user'>
                <span>Nguyễn Khắc Bảo</span>
                <img src="/avt.jpg" alt="avatar" className='navbar-admin__avatar'/>
            </div>
        </div>
    );
}

export default NavBarAdmin;