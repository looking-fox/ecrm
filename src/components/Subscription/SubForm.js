import React, { Component } from 'react'
import CardSection from './CardSection'
import Loading from '../Clients/Loading'
import {injectStripe} from 'react-stripe-elements';
import axios from 'axios'
import {connect} from 'react-redux'
import Fade from 'react-reveal'
import flow from 'lodash/flow'


class SubForm extends Component {
  constructor(){
    super()
    this.state = { loading : false, agreeCheck: false }
    this.cardHolderRef = React.createRef()
  }
  
  handleSubmit = (ev) => {
    //User Agrees to Terms/Conditions => Can Subscribe.
    const {pathname} = this.props.history.location

    if(this.state.agreeCheck || pathname === '/dashboard'){
    ev.preventDefault();
    
    if(pathname === '/dashboard'){
      //Updaitng User's Default Payment Method
      this.setState({loading: true}, () => {

        this.props.stripe.createToken().then( token => {
          axios.post('/api/stripe/updatecard', {token} )
          .then( response => {
            this.setState({loading: false}, () => {
              
              this.cardHolderRef.current.cardRef.current._element.clear()
              this.props.updateCardUI(response.data)
            })
             
          })
        })

      })
    }

    else {
      //Setting Up Initial Subscription 
      this.props.paymentProgress()
      
      this.props.stripe.createToken().then( token => {
        axios.post('/api/stripe/addpayment', {token} )
        .then(status => {
          if(status.data === "new"){
            //First Time User => Send Transaction Email. Push to Dashboard with Tutorial Open.
            axios.post('/api/email/signup').then(() => {
              this.props.history.push('/dashboard/welcome')
            })
          }
            //Returning User That Cancelled
          else this.props.history.push('/dashboard')

        }).catch(() => alert("Payment failed.") ) 
      })
    }
  }
  else {
    alert('You need to agree to the Terms of Service.')
  }
  };
  
  render() {
    const {pathname} = this.props.history.location
    const {loading} = this.state
    return (
      <form >

        {/* If loading, render Loading animation and hide card input. Card input cleared via Refs onClick. */}
        <div style={ loading ? {display: 'none'} : {} }>
        <CardSection ref={this.cardHolderRef}/>
        </div>

        <div style={ loading ? {} : {display: 'none'} }
        className="update-card center column">
          <Loading small />
          <p style={{marginTop: '10px'}}> Updating Card... </p>
        </div>

        {/* Show Agreement Checkbox if registering. Required to continue. */}

        <div className="agree-container center"
        style={pathname === '/dashboard' ? {display: 'none'} : {} }>
        <input type="checkbox" id="term-check" 
        onChange={e => this.setState({agreeCheck: e.target.value})}/>
        <label htmlFor="term-check"> I agree to the <a href="https://app.termly.io/document/terms-of-use-for-saas/c574334a-93e2-4fc1-a7b4-63c6ae0b00e4">Terms of Service</a></label>
        
        </div>

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
