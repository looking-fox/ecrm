import React, { Component } from 'react'
import './SignUp.css'
import Subscription from './Subscription'
import Loading from '../Clients/Loading'
import Fade from 'react-reveal'
import logo from '../../assets/logo.png'

export default class SignUp extends Component {
  constructor(){
    super()
    this.state = {inProgress: false, progressText: '🏗️  Processing...'}
    this.progressTimer = null;
  }

  paymentProgress = () => {
    this.setState({inProgress: true}, () => {
        this.progressTimer = setTimeout(() => {
          this.setState({progressText: '🏠 Setting Up Account...'})
        }, 3000)
    })
  }

  componentWillUnmount(){
    clearTimeout(this.progressTimer)
  }

  render() {
    const { inProgress, progressText } = this.state
    return (
      <div className="sign-up-container center column">

        <div className="payment-container center column">

              <div className="center column" style={ inProgress ? {display: 'none'} : {} }>

              <img src={logo} className="payment-logo"/>
              <div className="info-desc center column">
                  <Fade top>
                    <h3>One week free trial.</h3>
                    <h3>Lock in beta pricing at $3/month.</h3>
                    <h3>Cancel anytime.</h3>
                  </Fade>
              </div>

                <Subscription {...this.props}
                paymentProgress={this.paymentProgress}/>

                <i className="fab fa-stripe icon-stripe"/> 
            </div>


            <div className="center column"
            style={inProgress ? {} : {display: 'none'}}>
              <Loading/>
              <p className="progress-text">
                {progressText}
              </p>
            </div>
         
        </div>
        
      </div>
    )}
}
