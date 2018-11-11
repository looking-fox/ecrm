import React, { Component } from 'react'
import './Client.css'

export default class Client extends Component {

handleClick = () => {
    alert('Clicked button')
}

  render() {
    //MISSING: Session Name should have varying color based on sessionId.

    //City
    // https://www.google.com/maps/place/Whitefish+MT

    //Venue
    //https://www.google.com/maps/place/Hampton+Inn+%26+Suites+Whitefish


    
    return (
        <div className="clientcontainer">

        <div className="client">

        <div className="name item">
        <p>{this.props.name}</p>
        </div>

        <div className="package item">
        <span className="bubble">{this.props.sessionName}</span>
        </div>

        <div className="date item">
        <p>{this.props.sessionDate}</p>
        </div>

        <div className="location item">
        <p><i className="far fa-map"/>{this.props.sessionLocation}</p>
        </div>

        <div className="total item">
        <p>{this.props.sessionPrice}</p>
        </div>

        <div className="settings">
        <i className="fas fa-ellipsis-h"/>
        </div>

    </div>

  

    </div>
    )
  }
}
