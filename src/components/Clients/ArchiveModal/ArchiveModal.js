import React, { Component } from 'react'
import './ArchiveModal.css'
import Modal from 'react-responsive-modal'
import {connect} from 'react-redux'
import {archiveClientModal} from '../../../redux/reducer'

export default class ArchiveModal extends Component {

closeModal = () => {
    this.props.archiveClientModal({open: false, client: {}})
}


  render() {
    return (
        <Modal 
        open={false} 
        onClose={this.closeModal} center>

        <div className="archive-client-modal">
        
        </div>

        </Modal>
    )
  }
}


// function mapStateToProps(state){
//     return {
//         ...this.props, ...state
//     }
// }

// export default connect(mapStateToProps, archiveClientModal )(archiveClientModal)