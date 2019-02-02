import React, { Component } from 'react'
import PropTypes from 'prop-types'
import DatePicker from 'react-date-picker'
import { convertRawMoney, convertToMiles, convertRawMiles, convertToRawMoney, convertToLocalDate } from '../../../../Main/MainLogic'

export default class Payment extends Component {
    constructor(props) {
        super(props)

        this.state = {
            amount: props.showMileage ? convertToMiles(props.item.amount) : convertRawMoney(props.item.amount),
            description: props.item.description,
            date: convertToLocalDate(props.item.date)
        }

    }

    //Convert string input to raw integer on change. Set state to string value with commas/$ symbol. But pass up integer to store.
    updateAmount = () => {
        if (this.state.amount) {
            const { amount, description, date } = this.state
            const { id, index } = this.props
            const { intAmount, stringAmount } = convertMethod(amount, this.props.showMileage)
            this.setState({ amount: stringAmount }, () => {
                let newInfo = { amount: intAmount, description, date }
                this.props.updateItem(newInfo, index, id)
            })
        }

        function convertMethod(amount, mileage) {
            let intAmount, stringAmount
            if (mileage) {
                intAmount = convertRawMiles(amount)
                stringAmount = convertToMiles(intAmount)
            } else {
                intAmount = convertToRawMoney(amount)
                stringAmount = convertRawMoney(intAmount)
            }
            return { intAmount, stringAmount }
        }
    }

    updateDate = date => {
        this.setState({ date })
        const { id, index } = this.props
        const { amount, description } = this.state
        let intAmount = convertToRawMoney(amount)
        let newInfo = { amount: intAmount, date, description }
        this.props.updateItem(newInfo, index, id)
    }

    render() {
        const { item, index } = this.props
        return (
            <div className="row">

                <div className="pay pay-amount">

                    <input
                        className="row-input amount-input"
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
                        value={this.state.description}
                        onChange={e => this.setState({ description: e.target.value })}
                        onBlur={this.updateAmount} />
                    <i className="far fa-trash-alt row-delete"
                        onClick={() => this.props.verifyDelete(index, item)} />
                </div>

            </div>
        )
    }
}

Payment.propTypes = {
    item: PropTypes.shape({
        amount: PropTypes.number.isRequired,
        description: PropTypes.string.isRequired,
        date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]).isRequired
    }).isRequired
}