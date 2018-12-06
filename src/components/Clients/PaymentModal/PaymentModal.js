import React, { Component } from 'react'
import './PaymentModal.css'
import Payment from './Payment/Payment'
import Modal from 'react-responsive-modal'
import DatePicker from 'react-date-picker'
import axios from 'axios'
import {connect} from 'react-redux'
import {updateProps} from '../../../redux/reducer'
import {convertToRawMoney, convertRawMoney} from '../../../redux/functions'

class PaymentModal extends Component {
    constructor(){
        super()
        this.state = {
            payments: [],
            paid: 0,
            total: 0,
            totalPaid: 0,
            amount: '',
            date: new Date(),
            description: '',
            noPayments: false,
            updates: {},
            deletes: {},
            notSavedPayments: {},
            verifyDelete: false,
            deleteInfo: {}
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
  //currentPayments makes deep copy of [{}] to avoid changing state.
  updateProgressBar = () => {
      if(this.state.payments[0]){
      const {sessionPrice} = this.props.paymentModal
      let currentPayments = JSON.parse(JSON.stringify(this.state.payments.slice()))
      
      let paid = currentPayments.reduce((a,b) => {
          a.amount += b.amount
          return a
      }).amount

      let filterSessionPrice = parseInt(sessionPrice.replace(/[$,]+/g, "") )
      let percentage = Math.round( paid / filterSessionPrice * 100 )
     
      this.setState({paid: percentage, total: filterSessionPrice, totalPaid: paid, noPayments: false})
  
    }
    else {
        const {sessionPrice} = this.props.paymentModal
        let filterSessionPrice = parseInt(sessionPrice.replace(/[$,]+/g, "") )
        this.setState({paid: 0, total: filterSessionPrice, noPayments: true})
    }
  }

  convertAmount = () => {
      if(this.state.amount){
      const {amount} = this.state
      let intAmount = convertToRawMoney(amount)
      let filterAmount = convertRawMoney(intAmount)
      this.setState({ amount: filterAmount })
      }
  }

  savePayment = () => {
      const {amount, date, description} = this.state
      let intAmount = convertToRawMoney(amount)
      const {clientId} = this.props.paymentModal
      axios.post('/api/savepayment', {amount: intAmount, date, description, clientId}).then((response) => {
         var prevPayments = this.state.payments.slice()
         var notSaved = JSON.parse(JSON.stringify(this.state.notSavedPayments) )
         const {payment_id} = response.data[0]

         notSaved[payment_id] = payment_id
         prevPayments.push(response.data[0])
         
            this.setState({
                payments: prevPayments, 
                initialPayments: prevPayments,
                notSavedPayments: notSaved,
                amount: '', 
                date: new Date(), 
                description: ''
            }, () => {
                this.updateProgressBar()
            })
      })
  }

  updatePayment = (id, newInfo, index) => {
    const {updates, payments} = this.state
    updates[id] = {...newInfo, ...{payment_id: id}}
    
    if(index >= 0){
        if(typeof newInfo.amount === 'number'){
        let newPayments = JSON.parse(JSON.stringify(payments.slice()))
        let newAmount = newInfo.amount
        newPayments[index].amount = newAmount

        this.setState({ payments: newPayments, updates }, () => {
            this.updateProgressBar()
        })
      }
    }
    else {
        this.setState({ updates })
    }
  }

  saveAllPayments = () => {
      const { updates } = this.state
      if( this.hasKeys(updates) ){
        axios.put('/api/updatepayments', {updates} )
        .then(() => this.handleDeletes() )
      }
      else {
          this.handleDeletes()
      }
  }

  handleDeletes = () => {
    const {deletes} = this.state
    for(var key in deletes){
        axios.delete(`/api/deletepayment/${key}`)
    }
    this.clearAndClose()
  }

  hasKeys(updates){
      for(var key in updates){
          return true
      }
      return false
  }

  verifyDelete = (index, payment) => {
    const {amount, client_id, payment_id} = payment
    let filterAmount = convertRawMoney(amount)
    let deleteInfo = {index, amount: filterAmount, client_id, payment_id}
    this.setState({verifyDelete: true, deleteInfo})
  }

  deletePayment = () => {
    const {payments, deletes, deleteInfo} = this.state
    const {payment_id} = deleteInfo
    let prevPayments = JSON.parse( JSON.stringify(payments) )

    prevPayments.splice(deleteInfo.index, 1)
    deletes[payment_id] = payment_id

    this.setState({payments: prevPayments, deletes, verifyDelete: false, deleteInfo: {} }, () => this.updateProgressBar() )
  }

  isReturnKey = e => {
    if(e.keyCode === 13) this.savePayment()
  }

  closeModal = () => {
    //If user adds payment, but doesn't want to save--delete added payments.
    const {notSavedPayments} = this.state
    if( this.hasKeys(notSavedPayments) ){
        for (var key in notSavedPayments){
            axios.delete(`/api/deletepayment/${key}`)
        }
    }
    this.clearAndClose()
  }

  clearAndClose = () => {
    this.setState({
        payments: [],
        paid: 0,
        total: 0,
        amount: '',
        date: new Date(),
        description: '',
        notSavedPayments: {}
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
                    <div className="no-progress center">
                    No Payments
                    </div>
                    :
                    <div className={`progress-completed center ${sessionColor}`}
                    style={{width: `${this.state.paid}%`}}>
                        <p>{convertRawMoney(this.state.totalPaid)}</p>
                        <p>/</p>
                        <p> {convertRawMoney(this.state.total)} </p>  
                    </div>
                    }
                    
                </div>
                
                <div className="payment-top-row-container">
                    <div className="row top-row-input">
                        <div className="pay pay-amount">

                        <input 
                        className="row-input amount-input"
                        placeholder="$50"
                        value={this.state.amount}
                        onChange={e => this.setState({amount: e.target.value})}
                        onBlur={ () => this.convertAmount() }/>

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
                        value={this.state.description}
                        onChange={e => this.setState({description: e.target.value})}
                        onKeyDown={e => this.isReturnKey(e)}/>

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
                                updatePayment={this.updatePayment}
                                deletePayment={this.deletePayment}
                                verifyDelete={this.verifyDelete}/>
                            ) 
                          })
                        }

                    
                </div>

                <button className="btn btn-dark save full payment-save-btn"
                onClick={this.saveAllPayments}>
                    <p>Save</p>
                </button>

            </div>

             <Modal open={this.state.verifyDelete} onClose={() => this.setState({verifyDelete: false, deleteInfo: {} })}>
            <div className="client-options">

             <h1 className="client-settings-modal-title">
             Delete payment of {this.state.deleteInfo.amount}?
             </h1>

             <button type="button" 
            className="btn btn-danger options"
            onClick={this.deletePayment}>
              Yes, Delete Payment
            </button>
            
            </div>
             </Modal>


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
