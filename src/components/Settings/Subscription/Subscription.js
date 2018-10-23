import React, { Component } from 'react'
import './Subscription.css'
import Nav from '../Nav/Nav'

export default class Subscription extends Component {
//Will implement Stripe + Stripe Elements to manage subscription. Users will be redirected to this page if no active subscription.

  render() {
    return (
      <div className="subdashboard">
        <Nav/>
        Subscription
      </div>
    )
  }
}
