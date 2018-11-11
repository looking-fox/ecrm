import React, { Component } from 'react'
import './ClientSettingsModal.css'
import Modal from 'react-responsive-modal'


export default class ClientSettingsModal extends Component {

  closeModal = () => {
    this.props.updateclientSettingsModal({ open: false })
  }

  render() {
    return (
        <Modal 
        open={this.props.clientSettingsModal.open} 
        onClose={this.closeModal} center>

        </Modal>
    )
  }
}
