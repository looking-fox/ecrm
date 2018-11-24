import React, { Component } from 'react'
import './PaymentModal.css'
import Modal from 'react-responsive-modal'
import {connect} from 'react-redux'
import {updateProps} from '../../../redux/reducer'

class PaymentModal extends Component {
    constructor(){
        super()
        this.state = {
            payments: [
                {"name" : 'person', amount: '$45'},
                {"name" : 'somer', amount: '$52'},
                {"name" : 'sour', amount: '$52'}
            ]
        }
    }
  closeModal = () => {
    this.props.updateProps({paymentModal: {open: false, clientId: null }})
  }

  render() {
    const {open, clientId} = this.props.paymentModal

    return (
        <Modal open={open} onClose={this.closeModal}>
            <div className="payment-container">
                <h3 className="title">
                    <i className="fas fa-dollar-sign"/>
                    Payments
                </h3>


                <div className="payment-table">
                    {this.state.payments.map(e => {
                       return(
                        <div className="row">
                          {e.name}
                        </div>
                       ) 
                    })}
                </div>

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
  
  export default connect(mapStateToProps, {updateProps})(PaymentModal)
