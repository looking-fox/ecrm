import React, { Component } from 'react'
import CardSection from './CardSection'
import {injectStripe} from 'react-stripe-elements';
import axios from 'axios'
import Fade from 'react-reveal'

class SubForm extends Component {
  
  handleSubmit = (ev) => {
    ev.preventDefault();
  
    this.props.stripe.createToken({name: this.props.name, email: this.props.email}).then( token => {
      let newToken = token.token
      axios.post('/api/stripe/addpayment', {token: newToken}).then( res => {
         
          
          // setTimeout(() => {
          //   this.props.history.push("/texteditor");
          // }, 2000)
          
      }).catch(() => alert("Payment failed."))
      
    });
  };
  
  render() {
    return (
      <form >
      <Fade top>
        <h3>7 day free trial.</h3>
        <h3>Lock in $3/month pricing during beta.</h3>
        <h3>Cancel anytime.</h3>
      </Fade>

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

export default injectStripe(SubForm)