import React from 'react'
import './Nav.css'
import {Link} from 'react-router-dom'

export default function Nav() {
  //TODO: Add active css property to current page. 
  return (
    <div className="menu-bar align-center">
  
        <Link to="/tools/templates">
        <li className="nav-item center">Templates</li>
        </Link>

        <Link to="/tools/finances">
        <li className="nav-item center">Finances</li>
        </Link>
   
      </div>
  )
}
