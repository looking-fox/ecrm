import React, { Component } from 'react'
import './Settings.css'
import {Link} from 'react-router-dom'
import Nav from './Nav/Nav'

export default class Settings extends Component {
  
  render() {
    return (
      <div className="dashboard">
        <Nav/>
        General
      </div>
    )
  }
}
