import React from 'react'
import './Footer.css'
import Logo from '../../assets/logo.png'

export default function Footer() {
    return (
      <div className="footer center column">
        <img src={Logo} alt="Logo" className="logo-image"/>
        <p>© Looking Fox. All rights reserved.</p>

        <div className="agreement center">
        <a href="https://app.termly.io/document/terms-of-use-for-saas/c574334a-93e2-4fc1-a7b4-63c6ae0b00e4">Terms of Service</a>
        
        <a href="https://app.termly.io/document/privacy-policy/1eb8b9ce-5fa7-427e-8df2-157a19f61807">Privacy Policy</a>
        </div>

      </div>
    )
  }

