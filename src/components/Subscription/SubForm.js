import React, { Component } from 'react'
import CardSection from './CardSection'
import {injectStripe} from 'react-stripe-elements';
import axios from 'axios'
import {connect} from 'react-redux'
import Fade from 'react-reveal'
import flow from 'lodash/flow'

class SubForm extends Component {
  constructor(){
    super()
    this.cardHolderRef = React.createRef()
  }
  
  handleSubmit = (ev) => {
    ev.preventDefault();
    const {pathname} = this.props.history.location

    if(pathname === '/dashboard'){
      //Updaitng User's Default Payment Method
      this.props.stripe.createToken().then( token => {
        axios.post('/api/stripe/updatecard', {token} )
        .then( response => {
          this.cardHolderRef.current.cardRef.current._element.clear()
          this.props.updateCardUI(response.data) 
        })
      })
    }

    else {
      //Setting Up Initial Subscription 
      this.props.paymentProgress()
      
      this.props.stripe.createToken().then( token => {
        axios.post('/api/stripe/addpayment', {token} ).then(() => {
          this.props.history.push('/dashboard')
        }).catch(() => alert("Payment failed.") ) 
      })
    }
  };
  
  render() {
    const {pathname} = this.props.history.location
    return (
      <form >

        <CardSection ref={this.cardHolderRef}/>

        <Fade>
          <button type="button" className="btn btn-dark full"
          onClick={this.handleSubmit}>
          {pathname === '/dashboard' ? 'Update Card' : 'Sign Up'}
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
