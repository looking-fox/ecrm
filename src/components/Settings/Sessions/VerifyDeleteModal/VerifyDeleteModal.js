import React from 'react'
import Modal from 'react-responsive-modal'
import PropTypes from 'prop-types'

export default function VerifyDeleteModal(props) {
    const {item, index} = props.session
  return (
    <Modal open={props.open} onClose={props.close} center>
         <h1 className="client-settings-modal-title">
                    Are you sure?
                    </h1> 

            <button type="button" 
            className="btn btn-danger options"
            onClick={() => props.deleteSession(item, index)}>

            <p>Yes, Delete {item ? item.session_name : ''}</p>

            </button>
    </Modal>
  )
}

VerifyDeleteModal.propTypes = {
  open: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  session: PropTypes.object.isRequired,
  deleteSession: PropTypes.func.isRequired
}
