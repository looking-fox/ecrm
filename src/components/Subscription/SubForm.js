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
    this.state = { loading : false }
    this.cardHolderRef = React.createRef()
  }
  
  handleSubmit = (ev) => {
    ev.preventDefault();
    const {pathname} = this.props.history.location

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
            //First Time User
            this.props.history.push('/dashboard/welcome')
          }
            //Returning User That Cancelled
          else this.props.history.push('/dashboard')

        }).catch(() => alert("Payment failed.") ) 
      })
    }
  };
  
  render() {
    const {pathname} = this.props.history.location
    const {loading} = this.state
    return (
      <form >
        
        <div style={ loading ? {display: 'none'} : {} }>
        <CardSection ref={this.cardHolderRef}/>
        </div>

        <div style={ loading ? {} : {display: 'none'} }
        className="update-card center column">
          <Loading small />
          <p style={{marginTop: '10px'}}> Updating Card... </p>
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
