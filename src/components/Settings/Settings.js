import React, { Component } from 'react'
import './Settings.css'
import {Link} from 'react-router-dom'

export default class Settings extends Component {
  render() {
    return (
      <div className="settingsdashboard">

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
    
      </div>
    )
  }
}
