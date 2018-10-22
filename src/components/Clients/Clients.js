import React, { Component } from 'react'
import './Clients.css'
import Client from '../Client/Client'

export default class Clients extends Component {
  render() {
    return (
      <div className="clientdashboard">
        <Client/>
      </div>
    )
  }
}
