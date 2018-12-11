import React, { Component } from 'react'
import './SubscriptionModal.css'
import Subscription from '../../Subscription/Subscription'
import Modal from 'react-responsive-modal'
import axios from 'axios'
const styles = { modal: {background: '#f2f2f2'} }


export default class SubscriptionModal extends Component {
  constructor(){
    super()
      this.state = {
        brand: '', 
        last4: null, 
        nextPayment: '',
        updateCard: false
      }
  }

  componentDidMount(){
    axios.get('/api/stripe/subinfo').then(response => {
      const {brand, last4, nextPayment} = response.data
      this.setState({brand, last4, nextPayment})
    })
  }

  render() {
    const { brand, last4, nextPayment, editCard } = this.state
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

            {editCard ? 
            <Subscription/> 
            :
            <div className="button-container center">

              <button type="button" class="btn btn-dark">
              <i className="fas fa-pen"/> Update Card
              </button>

              <button type="button" class="btn btn-danger">
                <i className="fas fa-ban"/> Cancel
              </button>

            </div>
            }

              
              
            </div>
        </Modal>
    )
  }
}
