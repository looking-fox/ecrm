import React from 'react'
import './Features.css'
import financeDash from '../../assets/finance_dash.png'
import mainDash from '../../assets/main_dash.png'
import Fade from 'react-reveal/Fade'

export default function Features() {
    return (
      <div className="features">


            <div className="features-grid">

                <Fade bottom>
                <div className="feature-item column">
                  <i className="fas fa-users"></i>
                  <p className="title">MANAGE CLIENTS </p>
                  <p>No overly complicated system to learn. Manage clients at ease.  </p>
                </div>
                </Fade>

                <Fade bottom>
                <div className="feature-item column">
                  <i className="fas fa-clone"/>
                  <p className="title">TEMPLATES </p>
                  <p>Set up clients with session templates and speed up your workflow.  </p>
                </div>
                </Fade>

                <Fade bottom>
                <div className="feature-item column">
                <i className="fas fa-credit-card"/>
                  <p className="title"> TRACK PAYMENTS </p>
                  <p>Record payments and quickly view monthly analytics. </p>
                </div>
                </Fade>

            </div>

            <div className="action-list">

                
                <div className="browser-dash center">
                  <Fade left>
                    <img className="finance-dash"
                    src={financeDash} alt="Dashboard Preview"/>
                  </Fade>

                  <Fade right>
                    <img className="main-dash"
                    src={mainDash} alt="Dashboard Preview"/>
                  </Fade>

                </div>
             

              <div className="action-list-text">
                <Fade top cascade>
                <p>Speed up your workflow.</p>
                <p>Keep track of your progress.</p>
                <p>Spend more time doing what you love.</p>
                </Fade>
              </div>

            </div>

            <div className="about">
            
            </div>
            
              <div className="pricing center column">
                <Fade>
                  
                  <h1>🏃 We're on the move. More features to come.</h1>
                  <p> ANALYTICS | QUESTIONNAIRES | REVIEWS | EMAIL TEMPLATES | MARKETING CAMPAIGNS | TAX INFO GENERATOR </p>

                </Fade>
              </div>
      
      </div>
    )
  }
