import React, { Component } from 'react'
import './SubscriptionModal.css'
import Subscription from '../../Subscription/Subscription'
import Modal from 'react-responsive-modal'
import axios from 'axios'
import Fade from 'react-reveal'
const styles = { modal: {background: '#f2f2f2'} }

export default class SubscriptionModal extends Component {
  constructor(){
    super()
      this.state = {
        brand: '', 
        last4: null, 
        nextPayment: '',
        updateCard: false,
        cancelCheckModal: false
      }
  }

  componentDidMount(){
    axios.get('/api/stripe/subinfo').then(response => {
      const {brand, last4, nextPayment} = response.data
      this.setState({brand, last4, nextPayment})
    })
  }

  toggleUpdateCard = () => {
    this.setState({updateCard: !this.state.updateCard})
  }

  toggleCancelCheckModal = () => {
    this.setState({cancelCheckModal: !this.state.cancelCheckModal})
  }

  cancelSubscription = () => {
    console.log('cancel this please')
  }

  render() {
    const { brand, last4, nextPayment, updateCard } = this.state
    return (
        <Modal open={this.props.open} onClose={this.props.hide}
        styles={styles}>
            <div className="subscription-modal align-center column">
            <h3 className="mod-title">Subscription</h3>

            <div className="sub-card-container">
                <p className="sub-info">
                  {brand} <i className="far fa-credit-card"/> ****{last4}
                </p>

                <p className="sub-info">
                  Next Payment: {nextPayment}
                </p>
            </div>

          {updateCard ? 
            <Fade>
               <Subscription {...this.props} /> 
               
               <button type="button" 
                className="btn btn-secondary full center cancel-update"
                onClick={this.toggleUpdateCard}>
                 <i className="fas fa-arrow-left"/> Back
                </button>
            </Fade>

            :
            <div className="button-container center">

              <button type="button" className="btn btn-dark"
              onClick={this.toggleUpdateCard}>
              <i className="fas fa-pen"/> Update Card
              </button>

              <button type="button" className="btn btn-danger"
              onClick={this.props.hide}>
                <i className="fas fa-ban"/> Cancel Subscription
              </button>

            </div>
          }

          </div>

          <Modal open={this.state.cancelCheckModal}
          onClose={this.toggleCancelCheckModal}>
              <div className="client-options">

              <h1 className="client-settings-modal-title">
                Are you sure?
              </h1> 

              <p 
              style={{marginBottom: '20px', textAlign: 'center'}}>
                We're sad to see you go! You will still have access for the remainder of this month's subscription. We'll keep your client + session information in case you come back. 
              </p>

              <button type="button" 
                className="btn btn-danger options"
                onClick={this.cancelSubscription}>
                  It's Not You...It's Me (Cancel)
              </button>

              </div>
          </Modal>

        </Modal>
    )
  }
}