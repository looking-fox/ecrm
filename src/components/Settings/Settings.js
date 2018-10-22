import React, { Component } from 'react'
import './Settings.css'
import {Link} from 'react-router-dom'

export default class Settings extends Component {
  render() {
    return (
      <div className="settingsdashboard">

      <navbar>
        <p className="menuitem">General</p>
        <p className="menuitem">Subscription</p>
        <p className="menuitem">Sessions</p>
      </navbar>
    
      </div>
    )
  }
}
