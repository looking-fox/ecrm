import React, { Component } from 'react'
import DatePicker from 'react-date-picker'
import {convertRawMoney, convertToRawMoney} from '../../../../redux/functions'

export default class Payment extends Component {
  constructor(){
      super()
      this.state = {
          amount: '', 
          description: '',
          date: new Date()
      }
  }

  componentDidMount(){
      if(this.props.payment){
      const {amount, description, date} = this.props.payment
      var filterDate = new Date(date)
      var filterAmount = convertRawMoney(amount)
      this.setState({ amount: filterAmount, description, date: filterDate })
      }
  }

  //Convert string input to raw integer on change. Set state to string value with commas/$ symbol. But pass up integer to store.
  updateAmount = () => { 
    if(this.state.amount){
        const {amount, description, date} = this.state
        let id = this.props.payment.payment_id
        let intAmount = convertToRawMoney(amount)
        let filterAmount = convertRawMoney(intAmount)

        this.setState({amount: filterAmount}, () => {
            let newInfo = {amount: intAmount, description, date}
            this.props.updatePayment(id, newInfo, this.props.index)
        })   
    }
  }

  updateDate = (date, id) => {
      this.setState({ date })
      const {amount, description} = this.state
      let newInfo = {amount, date, description}
      this.props.updatePayment(id, newInfo)
  }


  render() {
      const {payment, index} = this.props
      const {amount, description, date} = this.state
      let newInfo = {amount, description, date}
      let id = payment.payment_id

    return (
        <div className="row">

            <div className="pay pay-amount">

                <input 
                className="row-input amount-input"
                placeholder="$50"
                onChange={e => this.setState({amount: e.target.value})}
                onBlur={() => this.updateAmount() }
                value={this.state.amount}/>

            </div>

            <div className="pay pay-date">
                <DatePicker
                onChange={e => this.updateDate(e, id)}
                value={this.state.date}/>
            </div>

            <div className="pay pay-description">

                <input 
                className="row-input"
                placeholder="Deposit"
                value={this.state.description}
                onChange={e => this.setState({description: e.target.value})}
                onBlur={e => this.props.updatePayment(id, newInfo) }/>
                <i className="far fa-trash-alt row-delete"
                onClick={() => this.props.verifyDelete(index, payment)}/>
            </div>

        </div>
    )
  }
}
