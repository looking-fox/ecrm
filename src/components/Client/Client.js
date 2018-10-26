import React, { Component } from 'react'
import './Client.css'
import Actions from '../Actions/Actions'

export default class Client extends Component {

handleClick = () => {
    alert('Clicked button')
}

  render() {
    return (
        <div className="clientcontainer">

        <div className="client">

        <div className="name item">
        <p>John Smith</p>
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

   {/* <Actions/> */}

    </div>
    )
  }
}
