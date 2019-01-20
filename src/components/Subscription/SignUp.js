import React, { Component } from 'react'
import './SignUp.css'
import Subscription from './Subscription'
import Loading from '../Clients/Loading'
import Fade from 'react-reveal'
import logo from '../../assets/logo.png'
import axios from 'axios';

export default class SignUp extends Component {
  constructor() {
    super()
    this.state = {
      inProgress: false,
      progressText: '🏗️  Processing...',
      lifetime: false,
      agreeCheck: false
    }
    this.progressTimer = null;
  }

  componentDidMount() {
    axios.get('/api/checklifetime').then(user => {
      const { lifetime } = user.data
      if (!lifetime) this.props.history.push('/')
      this.setState({ lifetime })
    })

  }

  componentWillUnmount() {
    clearTimeout(this.progressTimer)
  }

  paymentProgress = () => {
    this.setState({ inProgress: true }, () => {
      this.progressTimer = setTimeout(() => {
        this.setState({ progressText: '🏠 Setting Up Account...' })
      }, 3000)
    })
  }

  checkBox = () => {
    this.setState({ agreeCheck: !this.state.agreeCheck })
  }

  agreeStatus = () => {
    const { agreeCheck } = this.state
    if (agreeCheck) {
      axios.post('/api/agreedtoterms').then(() => {
        this.props.history.push('/dashboard/welcome')
      })
    }
    else alert("Please agree to the terms of service")
  }

  render() {
    const { inProgress, progressText, lifetime } = this.state
    return (
      <div className="sign-up-container center column">

        <div className="payment-container center column">


          <div className="center column" style={inProgress ? { display: 'none' } : {}}>

            <img src={logo} alt="looking fox logo" className="payment-logo" />
            <div className="info-desc center column">
              <Fade top>
                {lifetime ?

                  <h3>Thank you for joining beta. You have free access! <span role="img" aria-label="celebration emoji">🎉</span> Just agree to the terms of service to get started.</h3>

                  :
                  <React.Fragment>
                    <h3>One week free trial.</h3>
                    <h3>Lock in beta pricing at $3/month.</h3>
                    <h3>Cancel anytime.</h3>
                  </React.Fragment>

                }
              </Fade>
            </div>
            {lifetime ?

              <div className="agree-container center column">
                <input type="checkbox" id="term-check"
                  onChange={this.checkBox} />
                <label htmlFor="term-check"> I agree to the <a href="https://app.termly.io/document/terms-of-use-for-saas/c574334a-93e2-4fc1-a7b4-63c6ae0b00e4">Terms of Service</a></label>
              </div>
              :
              <div className="center">
                <Subscription {...this.props}
                  paymentProgress={this.paymentProgress} />

                <i className="fab fa-stripe icon-stripe" />
              </div>
            }

          </div>

          <div style={lifetime ? { display: 'flex' } : { display: 'none' }}>
            <button type="button" className="btn btn-dark full" onClick={this.agreeStatus}> Continue to App
              </button>
          </div>

          <div className="center column"
            style={inProgress ? {} : { display: 'none' }}>
            <Loading />
            <p className="progress-text">
              {progressText}
            </p>
          </div>

        </div>

      </div>
    )
  }
}
