import React from 'react'
import './Nav.css'
import {Link} from 'react-router-dom'

export default function Nav() {
  return (
    <div className="menubar">
  
        <Link to="/tools/templates">
        <li className="navitem">Templates</li>
        </Link>

        <Link to="/tools/finances">
        <li className="navitem">Finances</li>
        </Link>
   
      </div>
  )
}
