import React, { Component } from 'react'
import './SignUp.css'
import Subscription from './Subscription'
import Fade from 'react-reveal'
import logo from '../../assets/logo.png'

export default class SignUp extends Component {
  render() {
    return (
      <div className="sign-up-container center column">

        <div className="payment-container center column">
          <img src={logo} className="payment-logo"/>
          <div className="info-desc center column">
              <Fade top>
                <h3>One week free trial.</h3>
                <h3>Lock in beta pricing at $3/month.</h3>
                <h3>Cancel anytime.</h3>
              </Fade>
          </div>

            <Subscription/>
            <i className="fab fa-stripe icon-stripe"/> 
           
            
        </div>
        
      </div>
    )
  }
}
