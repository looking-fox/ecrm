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
            amount: '',
            date: new Date(),
            description: ''
            
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

  savePayment = () => {
      const {amount, date, description} = this.state
      const {clientId} = this.props.paymentModal
      axios.post('/api/savepayment', {amount, date, description, clientId}).then((response) => {
         var prevPayments = this.state.payments.slice()
         prevPayments.push(response.data[0])
         this.setState({payments: prevPayments})
      })
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

                    <input 
                    className="row-input amount-input"
                    placeholder="$50"
                    onChange={e => this.setState({amount: e.target.value})}/>

                    </div>

                    <div className="pay pay-date">
                        <DatePicker
                        onChange={e => this.setState({date: e})}
                        value={this.state.date}/>
                    </div>

                    <div className="pay pay-description">

                       <input 
                       className="row-input"
                       placeholder="Deposit"
                       onChange={e => this.setState({description: e.target.value})}/>

                       <i className="fas fa-plus-square add-pay"
                       onClick={this.savePayment}/>
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
