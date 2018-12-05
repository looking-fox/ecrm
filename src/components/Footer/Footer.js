import React from 'react'
import './Footer.css'
import Logo from '../../assets/logo.png'

export default function Footer() {
    return (
      <div className="footer">
        <img src={Logo} alt="Logo" className="logo-image"/>
        <p>© Looking Fox. All rights reserved.</p>
      </div>
    )
  }

