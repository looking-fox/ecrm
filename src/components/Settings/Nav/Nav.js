import React from 'react'
import './Nav.css'
import {Link} from 'react-router-dom'

export default function Nav() {
  return (
    <div className="menubar">
        <Link to="/settings">
        <li className="item">General</li>
        </Link>

        <Link to="/settings/subscription">
        <li className="item">Subscription</li>
        </Link>

        <Link to="/settings/sessions">
        <li className="item">Sessions</li>
        </Link>

        
      </div>
  )
}
