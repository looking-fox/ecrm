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
            paid: 0,
            total: 0,
            amount: '',
            date: new Date(),
            description: '',
            noPayments: false,
            updates: {}   
        }
    }
  
  componentDidUpdate(prevProps){
    if(prevProps.paymentModal !== this.props.paymentModal){
        const {clientId} = this.props.paymentModal
        axios.get(`/api/getpayments/${clientId}`).then(response => {
            this.setState({payments: response.data})
            this.updateProgressBar()
        })
    }
  }

  //Determine perecent of amount paid vs session price. Update UI.
  updateProgressBar = () => {
      if(this.state.payments[0]){
      const {sessionPrice} = this.props.paymentModal
      const {payments} = this.state
      let paid = payments.reduce((a,b) => {
          a.amount += b.amount
          return a
      }).amount
      let filterSessionPrice = parseInt(sessionPrice.replace(/[$,]+/g, "") )
     
      let percentage = Math.round( paid / filterSessionPrice * 100 )
      this.setState({paid: percentage, total: filterSessionPrice, noPayments: false})
    }
    else {
        const {sessionPrice} = this.props.paymentModal
        let filterSessionPrice = parseInt(sessionPrice.replace(/[$,]+/g, "") )
        this.setState({paid: 0, total: filterSessionPrice, noPayments: true})
    }
  }

  savePayment = () => {
      const {amount, date, description} = this.state
      const {clientId} = this.props.paymentModal
      axios.post('/api/savepayment', {amount, date, description, clientId}).then((response) => {
         var prevPayments = this.state.payments.slice()
         prevPayments.push(response.data[0])
         this.setState({
            payments: prevPayments, 
            initialPayments: prevPayments,
            amount: '', 
            date: new Date(), 
            description: ''
        })
         this.updateProgressBar()
      })
  }

  updatePayment = (id, newInfo, index) => {
    const {updates, payments} = this.state
    updates[id] = {...newInfo, ...{payment_id: id}}
    console.log('index: ', index)
    if(index){
        let newPayments = payments.slice()
        let newAmount = parseInt(newInfo.amount)
        newPayments[index].amount = newAmount
        this.setState({ payments: newPayments, updates })
        this.updateProgressBar()
    }
    else {
        this.setState({ updates })
    }
    
  }

  

  saveAllPayments = () => {
      const {updates} = this.state
      if( this.hasKeys(updates) ){
        axios.put('/api/updatepayments', {updates} )
        .then(() => this.closeModal() )
      }
      else {
          this.closeModal()
      }
  }

  hasKeys(updates){
      for(var key in updates){
          return true
      }
      return false
  }

  closeModal = () => {
    this.setState({
        payments: [],
        paid: 0,
        total: 0,
        amount: '',
        date: new Date(),
        description: ''
    })
    this.props.updateProps({paymentModal: {open: false, clientId: null }})
  }

  render() {
    const {open, name, sessionColor} = this.props.paymentModal

    return (
        <Modal open={open} onClose={this.closeModal}>
            <div className="payment-container">
                <h3 className="title">
                    <i className="far fa-credit-card"/>
                    {name}
                </h3>
                
                <div className="progress-bar">

                    {this.state.noPayments ? 
                    <div className="no-progress">
                    No Payments
                    </div>
                    :
                    <div className={`progress-completed ${sessionColor}`}
                    style={{width: `${this.state.paid}%`}}>
                        {this.state.paid}%  
                    </div>
                    }

                </div>
                
                <div className="payment-top-row-container">
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
                </div>
                

                <div className="payment-table">
     
                        {this.state.payments.map((e,i) => {
                            return(
                                <Payment 
                                payment={e}
                                index={i}
                                key={e.payment_id}
                                updatePayment={this.updatePayment}/>
                            ) 
                          })
                        }

                    
                </div>

                <button className="btn btn-primary save full payment-save-btn"
                onClick={this.saveAllPayments}>
                    <p>Save</p>
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
  
  export default connect(mapStateToProps, {updateProps})(PaymentModal)
