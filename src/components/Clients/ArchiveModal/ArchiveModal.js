import React, { Component } from 'react'
import './ArchiveModal.css'
import Modal from 'react-responsive-modal'
import {connect} from 'react-redux'
import {archiveClient} from '../../../redux/reducer'

class ArchiveModal extends Component {

closeModal = () => {
    this.props.archiveClient({open: false, client: {}})
}


  render() {
      console.log(this.props.archiveClientModal)
    return (
        <Modal 
        open={this.props.archiveClientModal["open"]} 
        onClose={this.closeModal} center>

        <div className="archive-client-modal">
        
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

export default connect(mapStateToProps, {archiveClient})(ArchiveModal)