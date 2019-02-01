import React, { Component } from 'react'
import './SubscriptionModal.css'
import Subscription from '../../Subscription/Subscription'
import Modal from 'react-responsive-modal'
import axios from 'axios'
import Fade from 'react-reveal'
const styles = { modal: { background: '#f2f2f2' } }

export default class SubscriptionModal extends Component {
  constructor() {
    super()
    this.state = {
      brand: '',
      last4: null,
      nextPayment: '',
      canceledSub: false,
      updateCard: false,
      cancelCheckModal: false,
      lifetimeUser: false
    }
  }

  componentDidMount = () => {
    axios.get('/api/stripe/subinfo').then(response => {
      if (response.data === 'lifetime') {
        this.setState({ lifetimeUser: true })
      }
      else {
        const { brand, last4, nextPayment, canceledSub } = response.data
        this.setState({ brand, last4, nextPayment, canceledSub })
      }
    })
  }

  componentDidUpdate = () => {
    if (this.props.open === true && this.state.lifetimeUser) {
      this.props.hide()
      alert("You have free access. No subscription to check!")
    }
  }

  toggleUpdateCard = () => {
    this.setState({ updateCard: !this.state.updateCard })
  }

  toggleCancelCheckModal = () => {
    this.setState({ cancelCheckModal: !this.state.cancelCheckModal })
  }

  renewSubscription = () => {
    axios.put('/api/stripe/renewsub').then(() => {
      this.setState({ canceledSub: false })
    })
  }

  updateCardUI = (newCard) => {
    const { brand, last4 } = newCard
    this.setState({ brand, last4, updateCard: false })
  }

  cancelSubscription = () => {
    axios.delete('/api/stripe/cancelsub').then(() => {
      this.setState({ cancelCheckModal: false, canceledSub: true })
    })
  }

  render() {
    const { brand, last4, nextPayment, updateCard, canceledSub } = this.state
    return (
      <Modal open={this.props.open} onClose={this.props.hide}
        styles={styles}>
        <div style={nextPayment ? {} : { display: 'none' }}
          className="subscription-modal align-center column">

          <h3 className="mod-title">Subscription</h3>

          <div className="sub-card-container">
            <p className="sub-info">
              {brand} <i className="far fa-credit-card" /> ****{last4}
            </p>

            <p className="sub-info">
              {canceledSub ?
                'Access Until: ' : 'Next Payment: '}
              {nextPayment}
            </p>
          </div>

          {updateCard ?
            <Fade>
              <Subscription {...this.props}
                updateCardUI={this.updateCardUI} />

              <button type="button"
                className="btn btn-secondary full center cancel-update"
                onClick={this.toggleUpdateCard}>
                <i className="fas fa-arrow-left" /> Back
                </button>
            </Fade>

            :
            <div className="button-container center">

              <button type="button" className="btn btn-dark"
                onClick={this.toggleUpdateCard}>
                <i className="fas fa-pen" /> Update Card
              </button>

              {canceledSub ?
                <button type="button"
                  className="btn btn-dark renew-sub"
                  onClick={this.renewSubscription}>
                  Renew Subscription
              </button>
                :
                <button type="button" className="btn btn-danger"
                  onClick={this.toggleCancelCheckModal}>
                  <i className="fas fa-ban" /> Cancel Subscription
              </button>}

            </div>
          }

        </div>

        <Modal open={this.state.cancelCheckModal}
          onClose={this.toggleCancelCheckModal}>
          <div className="cancel-sub-modal center column">

            <h1 className="mod-title">
              We're sad to see you go 🌧
              </h1>

            <p>You will still have access for the remainder of this month's subscription. We'll keep your client + session information in case you come back.</p>

            <button type="button"
              className="btn btn-danger full"
              onClick={this.cancelSubscription}>
              It's Not You...It's Me (Cancel)
              </button>

          </div>
        </Modal>

      </Modal>
    )
  }
}