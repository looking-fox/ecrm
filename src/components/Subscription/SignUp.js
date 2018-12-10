import React, { Component } from 'react'
import './Subscription.css'
import Subscription from './Subscription'

export default class SignUp extends Component {
  render() {
    return (
      <div className="sign-up-container">

        <div className="about-section">
            hello about this
        </div>

        <div className="payment-section">
            <Subscription/>
        </div>
        
      </div>
    )
  }
}
