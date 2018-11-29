import React, { Component } from 'react'
import './PaymentModal.css'
import Payment from './Payment/Payment'
import Modal from 'react-responsive-modal'
import DatePicker from 'react-date-picker'
import axios from 'axios'
import {connect} from 'react-redux'
import {updateProps} from '../../../redux/reducer'


class PaymentModal extends Component {
    constructor(){
        super()
        this.state = {
            payments: [],
            date: new Date()
        }
    }
  
  componentDidUpdate(prevProps){
    if(prevProps.paymentModal !== this.props.paymentModal){
        const {clientId} = this.props.paymentModal
        axios.get(`/api/getpayments/${clientId}`).then(response => {
            this.setState({payments: response.data})
        })
        
    }
  }

  closeModal = () => {
    this.props.updateProps({paymentModal: {open: false, clientId: null }})
  }

  render() {
    const {open, clientId, name} = this.props.paymentModal

    return (
        <Modal open={open} onClose={this.closeModal}>
            <div className="payment-container">
                <h3 className="title">
                    <i className="far fa-credit-card"/>
                    {name}
                </h3>
                
                <div className="progress-bar">
                    <div className="progress-completed" style={{width: '25%'}}>25%</div>
                </div>
                

                <div className="payment-table">

                <div className="row top-row-input">
                    <div className="pay pay-amount">

                    <input className="row-input amount-input"
                    placeholder="$50"/>

                    </div>

                    <div className="pay pay-date">
                        <DatePicker
                        onChange={e => this.setState({date: e})}
                        value={this.state.date}/>
                    </div>

                    <div className="pay pay-description">

                       <input className="row-input"
                       placeholder="Deposit"/>
                       <i className="fas fa-plus-square add-pay"/>
                    </div>
                </div>

                    {this.state.payments.map(e => {
                       return(
                        <Payment 
                        payment={e}
                        key={e.payment_id} />
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
