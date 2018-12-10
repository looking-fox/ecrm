import React, { Component } from 'react'
import CardSection from './CardSection'
import {injectStripe} from 'react-stripe-elements';
import axios from 'axios'
import {connect} from 'react-redux'
import Fade from 'react-reveal'
import flow from 'lodash/flow'

class SubForm extends Component {
  
  handleSubmit = (ev) => {
    ev.preventDefault();
    
    this.props.stripe.createToken().then( token => {
      axios.post('/api/stripe/addpayment', {token} ).then(() => {
        this.props.history.push('/dashboard')
      })
      .catch(() => alert("Payment failed."))
      
    });
  };
  
  render() {
    return (
      <form >

        <CardSection />

        <Fade bottom>
          <button type="button" className="btn btn-dark full"
          onClick={this.handleSubmit}>
          Sign Up
          </button>
        </Fade>
        
    </form>
    )
  }
}


function mapStateToProps(state){
  return {
    ...this.props, ...state
  }
}

export default flow( connect(mapStateToProps) )( injectStripe(SubForm) )
