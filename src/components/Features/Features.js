import React, { Component } from 'react'
import './Features.css'

export default class Features extends Component {
  render() {
    return (
      <div className="features">
        <div className="featureitem">
        <i className="fas fa-file-alt"></i>
          <p>CUSTOM FEEDBACK </p>
        </div>

        <div className="featureitem">
        <i className="fas fa-users"></i>
          <p>MANAGE CLIENTS </p>
        </div>

        <div className="featureitem">
        <i className="fas fa-list-ul"></i>
          <p>TO DO LIST </p>
        </div>
      </div>
    )
  }
}
