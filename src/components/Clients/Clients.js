import React, { Component } from 'react'
import './Clients.css'

export default class Clients extends Component {
  render() {
    return (
      <div className="clientdashboard">

        <div className="client">

          <div className="name item">
          <p>John Smith</p>
          </div>

          <div className="email item">
          <p>jsmith@gmail.com</p>
          </div>

          <div className="package item">
          <span className="bubble">Elopement</span>
          </div>

          <div className="date item">
          <p>10 / 05 / 2018</p>
          </div>

          <div className="location item">
          <p>Whitefish, Montana</p>
          </div>

          <div className="total item">
          <p>$2,500</p>
          </div>

          <div className="settings">
          <i className="fas fa-ellipsis-h"/>
          </div>

        </div>


        

      </div>
    )
  }
}
