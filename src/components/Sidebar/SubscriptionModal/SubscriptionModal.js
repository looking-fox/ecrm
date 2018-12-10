import React, { Component } from 'react'
import './SubscriptionModal.css'
import Subscription from '../../Subscription/Subscription'
import Modal from 'react-responsive-modal'
const styles = {
  modal: {background: 'linear-gradient(#7e999b, #417285)'},
  closeIcon: {fill: 'white'}
}

export default class SubscriptionModal extends Component {
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
