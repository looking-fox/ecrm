import React, { Component } from 'react'
import './Features.css'
import screenshot from '../../assets/dashboard.png'

export default class Features extends Component {
  render() {
    return (
      <div className="features">


            <div className="features-grid">

                <div className="featureitem">
                  <i className="fas fa-users"></i>
                  <p className="title">MANAGE CLIENTS </p>
                  <p>No overly complicated system to learn. Manage clients at ease.  </p>
                </div>

                <div className="featureitem">
                  <i className="fas fa-list-ul"></i>
                  <p className="title">CUSTOM TO-DO LISTS </p>
                  <p>Create a customized to-do list for all of your packages/sessions. </p>
                </div>

            </div>


            <div className="action-list">

              <div className="action-list-image">
                <img src={screenshot}/>
              </div>

              <div className="action-list-text">
                <p>Every client deserves a to-do list.</p>
                <p>Every photographer deserves a break. </p>
              </div>

            </div>

            <div className="pricing">
              <h1>Open for Beta!</h1>
              <h4>Provide feedback. Get free lifetime acccess. </h4>
              <p>Limited spots available.</p>
              <button type="button" className="btn btn-primary">
              <i className="far fa-envelope"/> Contact Us 
              </button> 
            </div>

      </div>
    )
  }
}
