import React from 'react';
import './Navbar.css'
import nav_logo from '../../assets/nav-logo.svg';
import navprofile from '../../assets/nav-profile.svg'
function Navbar(props) {
    return (
        <div className='navbar'>
            <img src={nav_logo} alt="" className="nav-logo" />
            <img src={navprofile} alt=""  className='nav-profile'/>
        </div>
    );
}

export default Navbar;