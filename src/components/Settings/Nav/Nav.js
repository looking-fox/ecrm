import React from 'react'
import './Nav.css'
import {Link} from 'react-router-dom'

export default function Nav() {
  return (
    <div className="menubar">
        <Link to="/settings">
        <li className="navitem">General</li>
        </Link>

        <Link to="/settings/subscription">
        <li className="navitem">Subscription</li>
        </Link>

        <Link to="/settings/sessions">
        <li className="navitem">Sessions</li>
        </Link>

        
      </div>
  )
}
