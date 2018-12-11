import React, { Component } from 'react'
import './SubscriptionModal.css'
import Subscription from '../../Subscription/Subscription'
import Modal from 'react-responsive-modal'
import axios from 'axios'
const styles = {
  modal: {background: 'linear-gradient(#7e999b, #417285)'},
  closeIcon: {fill: 'white'}
}

export default class SubscriptionModal extends Component {
  constructor(){
    super()
    this.state = {brand: '', last4: null, nextPayment: ''}
  }

  componentDidMount(){
    axios.get('/api/stripe/subinfo').then(response => {
      const {brand, last4, nextPayment} = response.data
      this.setState({brand, last4, nextPayment}, () => console.log(this.state))
      
    })
  }

  render() {
    return (
        <Modal open={this.props.open} onClose={this.props.hide}
        styles={styles}>
            <div className="subscription-modal align-center column">
              <Subscription/>
            </div>
        </Modal>
    )
  }
}
