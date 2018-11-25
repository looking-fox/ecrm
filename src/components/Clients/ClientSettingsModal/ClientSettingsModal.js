import React, { Component } from 'react'
import './ClientSettingsModal.css'
import Modal from 'react-responsive-modal'
import {connect} from 'react-redux'
import {updateClientSettingsModal, updateClientModal, updateClients} from '../../../redux/reducer'
import axios from 'axios';

class ClientSettingsModal extends Component {
  constructor(){
    super()
      this.state = {
        deleteVerifyOpen: false
      }
  }

  deleteClient = () => {
    const {clientId, sessionId} = this.props.clientSettingsModal.client

    var updatedClients = this.props.clients.slice()
    var index = updatedClients.findIndex(element => {
      return element.client_id === clientId
    })

    updatedClients.splice(index, 1)
    this.props.updateClients({ clients: updatedClients })

    axios.delete(`/api/deleteclient/${sessionId}`).then(() => {
      this.props.updateClientSettingsModal({ 
        clientSettingsModal: {open: false, newClient: true, client: {}},
        clientModalOpen: false
      })
      this.props.optDeleteModal()
    })
  }
    
  render() {
    const {clientSettingsModal} = this.props
  
    return (
          <Modal open={this.props.deleteVerify}
          onClose={() => this.props.optDeleteModal()}>

              <div className="client-options">
                    <h1 className="client-settings-modal-title">
                    Are you sure?
                    </h1> 
                    <p style={{marginBottom: '20px', textAlign: 'center'}}>
                      This will permanently delete your client.
                    </p>

                    <button type="button" 
                className="btn btn-danger options"
                onClick={this.deleteClient}>
                  Yes, Delete {clientSettingsModal.client.name}
                  </button>
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

export default connect(mapStateToProps, {updateClientSettingsModal, updateClientModal, updateClients})(ClientSettingsModal)