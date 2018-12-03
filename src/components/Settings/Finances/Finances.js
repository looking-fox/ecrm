import React, { Component } from 'react'
import './Finances.css'
import Nav from '../Nav/Nav'

export default class Finances extends Component {
  render() {
    return (
      <div className="subdashboard">
        <Nav/>
        Finances
      </div>
    )
  }
}
