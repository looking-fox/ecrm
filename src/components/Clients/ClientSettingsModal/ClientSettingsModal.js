import React, { Component } from 'react'
import './ClientSettingsModal.css'
import Modal from 'react-responsive-modal'
import {connect} from 'react-redux'
import updateclientSettingsModal from '../../../redux/reducer'

class ClientSettingsModal extends Component {

  closeModal = () => {
    this.props.updateClientSettingsModal({ 
      clientSettingsModal: {open: false, client: {}}
    })
  }
    
  render() {
    
    return (
        <Modal 
        open={this.props.clientSettingsModal['open']} 
        onClose={this.closeModal} center>

          <h1 className="client-settings-modal-title">
          <i className="far fa-user"/>{this.props.clientSettingsModal.client.name}
          </h1>

          <div className="client-options">

                <button type="button" class="btn btn-primary options"
                onClick={() => alert('update')}>Update</button>

                 <button type="button" class="btn btn-danger options"
                onClick={() => alert('update')}>Delete</button>

          </div>

        </Modal>
    )
  }
}


function mapStateToProps(state){
  return {
    ...this.props, ...state
  }
}

export default connect(mapStateToProps, {updateclientSettingsModal})(ClientSettingsModal)
