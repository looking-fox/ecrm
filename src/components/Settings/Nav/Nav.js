import React from 'react'
import './Nav.css'
import { NavLink } from 'react-router-dom'

export default function Nav() {
  return (
    <div className="menu-bar align-center">

      <NavLink to="/tools/templates">
        <li className="nav-item center">Templates</li>
      </NavLink>

      <NavLink to="/tools/finances">
        <li className="nav-item center">Finances</li>
      </NavLink>

    </div>
  )
}