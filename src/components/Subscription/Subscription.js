import React, { Component } from 'react'
import './Subscription.css'
import {Elements} from 'react-stripe-elements';
import InjectedSubForm from './SubForm'
import {connect} from 'react-redux'

const fonts = [{ cssSrc: "https://fonts.googleapis.com/css?family=Open+Sans" }]

class Subscription extends Component {
  render() {
    return (
        <div className="sub-container center column">
        <Elements fonts={fonts} >
            <InjectedSubForm />
        </Elements>
        </div>
    )
  }
}

function mapStateToProps(state){
  return {
    ...this.props, ...state
  }
}

export default connect(mapStateToProps)(Subscription)


