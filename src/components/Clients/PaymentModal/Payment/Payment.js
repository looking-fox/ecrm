import React, { Component } from 'react'

export default class Payment extends Component {
  constructor(){
      super()
      this.state = {
          amount: '', 
          description: '',
          date: '',
          editAmount: false,
          editDescription: false
      }
  }

  componentDidMount(){
      if(this.props.payment){
      const {amount, description, date} = this.props.payment
      this.setState({ amount, description, date })
      }
  }

  render() {
      const {amount, date, description} = this.state
    return (
        <div className="row">

            <div className="pay pay-amount">
                ${amount}
            </div>

            <div className="pay pay-date">
                {date}
            </div>

            <div className="pay pay-description">
                {description}
            </div>

        </div>
    )
  }
}
