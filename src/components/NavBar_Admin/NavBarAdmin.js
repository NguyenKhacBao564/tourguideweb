import React from 'react';
import "./NavBarAdmin.scss"

function NavBarAdmin({user, header}) {
    
    return (
        <div className="navbar-admin">
            <h1 className='navbar-admin__title'>{header}</h1>

            <div className='navbar-admin__user'>
                <span>{user.name}</span>
                <img src="/avt.jpg" alt="avatar" className='navbar-admin__avatar'/>
            </div>
        </div>
    );
}

export default NavBarAdmin;