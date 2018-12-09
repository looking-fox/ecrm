import React, { Component } from 'react'
import CardSection from './CardSection'
import {injectStripe} from 'react-stripe-elements';
import axios from 'axios'

class SubForm extends Component {

  handleSubmit = (ev) => {
    ev.preventDefault();
  
    this.props.stripe.createToken({name: 'this.props.name', email: this.props.email}).then( token => {
      
      // axios.post('/api/payment', {token}).then( res => {
      //     console.log('res: ', res)
          // setTimeout(() => {
          //   this.props.history.push("/texteditor");
          // }, 2000)
          
      // })
    });
  };
  
  render() {
    return (
      <form >
      <h3>7 day free trial.</h3>
      <h3>Lock in $3/month pricing during beta.</h3>
      <h3>Cancel anytime.</h3>
      <CardSection />
      <button type="button" className="btn btn-dark full"
      onClick={this.handleSubmit}>
      Sign Up
      </button>
    </form>
    )
  }
}

export default injectStripe(SubForm)
