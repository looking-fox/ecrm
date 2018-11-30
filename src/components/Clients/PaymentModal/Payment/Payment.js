import React, { Component } from 'react'
import DatePicker from 'react-date-picker'


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
      this.setState({ amount, description, date: filterDate })
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
                onBlur={e => this.props.updatePayment(id, newInfo, index) }
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

            </div>

        </div>
    )
  }
}
