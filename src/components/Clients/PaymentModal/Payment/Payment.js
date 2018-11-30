import React, { Component } from 'react'
import DatePicker from 'react-date-picker'
import axios from 'axios'

export default class Payment extends Component {
  constructor(){
      super()
      this.state = {
          amount: '', 
          description: '',
          date: new Date(), 
          saved: false
      }
  }

  componentDidMount(){
      if(this.props.payment){
      const {amount, description, date} = this.props.payment
      var filterDate = new Date(date)
      this.setState({ amount, description, date: filterDate })
      }
  }

  updatePayment = () => {
      if(this.state.saved){
          this.setState({saved: false})
      }
      const {amount, date, description} = this.state
      const {client_id, payment_id} = this.props.payment
      axios.put('/api/updatepayment', {amount, date, description, client_id, payment_id}).then(() => {
          this.setState({saved: true})
      })
    
  }

  render() {
     const {saved} = this.state
    return (
        <div className={saved ? "row save-payment" : "row"}>

            <div className="pay pay-amount">

                <input 
                className="row-input amount-input"
                placeholder="$50"
                onChange={e => this.setState({amount: e.target.value})}
                value={this.state.amount}/>

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
                onChange={e => this.setState({description: e.target.value})}/>

                <i className="fas fa-save add-pay"
                onClick={this.updatePayment}/>

            </div>

        </div>
    )
  }
}
