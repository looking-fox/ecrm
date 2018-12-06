import React, { Component } from 'react'
import './SubscriptionModal.css'
import Modal from 'react-responsive-modal'

export default class SubscriptionModal extends Component {
  render() {
    return (
        <Modal open={this.props.open} onClose={this.props.hide}>
            <div className="subscription-modal">
              <h3 className="title"> Subscription </h3>
            </div>
        </Modal>
    )
  }
}
