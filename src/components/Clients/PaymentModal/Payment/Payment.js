import React, { Component } from 'react'
import PropTypes from 'prop-types'
import DatePicker from 'react-date-picker'
import { convertRawMoney, convertToRawMoney, convertToLocalDate } from '../../../../Main/MainLogic'

export default class Payment extends Component {
    constructor(props) {
        super(props)
        this.state = {
            amount: convertRawMoney(props.payment.amount),
            description: props.payment.description,
            date: convertToLocalDate(props.payment.date)
        }
    }

    //Convert string input to raw integer on change. Set state to string value with commas/$ symbol. But pass up integer to store.
    updateAmount = () => {
        if (this.state.amount) {
            const { amount, description, date } = this.state
            const { id, index } = this.props
            let intAmount = convertToRawMoney(amount)
            let filterAmount = convertRawMoney(intAmount)

            this.setState({ amount: filterAmount }, () => {
                let newInfo = { amount: intAmount, description, date }
                this.props.updatePayment(newInfo, index, id)
            })
        }
    }

    updateDate = date => {
        this.setState({ date })
        const { id, index } = this.props
        const { amount, description } = this.state
        let intAmount = convertToRawMoney(amount)
        let newInfo = { amount: intAmount, date, description }
        this.props.updatePayment(newInfo, index, id)
    }

    render() {
        const { payment, index } = this.props
        const { amount, description, date } = this.state
        let filterAmount = convertToRawMoney(amount)
        let newInfo = { amount: filterAmount, description, date }

        return (
            <div className="row">

                <div className="pay pay-amount">

                    <input
                        className="row-input amount-input"
                        placeholder="$50"
                        onChange={e => this.setState({ amount: e.target.value })}
                        onBlur={this.updateAmount}
                        value={this.state.amount} />

                </div>

                <div className="pay pay-date">
                    <DatePicker
                        onChange={e => this.updateDate(e)}
                        value={this.state.date} />
                </div>

                <div className="pay pay-description">

                    <input
                        className="row-input"
                        placeholder="Deposit"
                        value={this.state.description}
                        onChange={e => this.setState({ description: e.target.value })}
                        onBlur={this.updateAmount} />
                    <i className="far fa-trash-alt row-delete"
                        onClick={() => this.props.verifyDelete(index, payment)} />
                </div>

            </div>
        )
    }
}

Payment.propTypes = {
    payment: PropTypes.shape({
        amount: PropTypes.number.isRequired,
        description: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired
    }).isRequired
}