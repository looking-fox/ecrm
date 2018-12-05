import React, { Component } from 'react'
import './Features.css'
import screenshot from '../../assets/dashboard.png'
import Fade from 'react-reveal/Fade'

export default class Features extends Component {
  render() {
    return (
      <div className="features">


            <div className="features-grid">

                <Fade bottom>
                <div className="featureitem">
                  <i className="fas fa-users"></i>
                  <p className="title">MANAGE CLIENTS </p>
                  <p>No overly complicated system to learn. Manage clients at ease.  </p>
                </div>
                </Fade>

                <Fade bottom>
                <div className="featureitem">
                  <i className="fas fa-clone"/>
                  <p className="title">TEMPLATES </p>
                  <p>Set up clients with session templates and speed up your workflow.  </p>
                </div>
                </Fade>

                <Fade bottom>
                <div className="featureitem">
                <i className="fas fa-credit-card"/>
                  <p className="title">Track Payments </p>
                  <p>Record payments and quickly view monthly analytics. </p>
                </div>
                </Fade>

            </div>

            <div className="action-list">

              <div className="action-list-image">
                <img src={screenshot} alt="Dashboard Preview"/>
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
              <button type="button" className="btn btn-primary"
              onClick={() => this.props.history.push('/contact')}>
              <i className="far fa-envelope"/> Contact Us 
              </button>
            </div>

      </div>
    )
  }
}
