import React, { Component } from 'react'
import Modal from 'react-responsive-modal'
import DatePicker from 'react-date-picker'
import axios from 'axios'
import Table from '../Table/Table'
import { convertToRawMoney, convertRawMoney } from '../../../../Main/MainLogic'

export default class ExpenseTable extends Component {
    constructor() {
        super()
        this.state = {
            expenses: [],
            amount: '',
            date: new Date(),
            description: '',
            verifyDelete: false,
            deleteInfo: {},
            savingStatus: false
        }
    }

    componentDidMount() {
        const { clientId } = this.props
        axios.get(`/api/getexpenses/${clientId}`)
            .then(response => {
                this.setState({ expenses: response.data })
            })
    }

    saveExpense = () => {
        const { amount, date, description, expenses } = this.state

        if (!amount || !description) {
            alert('Please fill in the payment information before adding it.')
            return
        }
        let intAmount = convertToRawMoney(amount)
        const { clientId } = this.props

        this.setState({ savingStatus: true })
        axios.post('/api/saveexpense', { amount: intAmount, date, description, clientId })
            .then(response => {
                let prevExpenses = [...expenses]
                prevExpenses.push(response.data[0])

                this.setState({
                    expenses: prevExpenses,
                    amount: '',
                    date: new Date(),
                    description: '',
                    savingStatus: false
                })
            })
    }

    updateExpense = (newInfo, index) => {
        const { expenses } = this.state
        let newExpenses = [...expenses]
        newExpenses[index] = { ...newExpenses[index], ...newInfo }

        this.setState({ expenses: newExpenses, savingStatus: true }, () => {
            axios.put('/api/updatepayment', { expense: newExpenses[index] })
                .then(() => this.setState({ savingStatus: false }))
        })
    }

    verifyDelete = (index, payment) => {
        const { amount, client_id, expense_id } = payment
        let filterAmount = convertRawMoney(amount)
        let deleteInfo = { index, amount: filterAmount, client_id, expense_id }
        this.setState({ verifyDelete: true, deleteInfo })
    }

    deleteExpense = () => {
        const { expenses, deleteInfo } = this.state
        const { expense_id } = deleteInfo
        let prevExpenses = [...expenses]
        prevExpenses.splice(deleteInfo.index, 1)

        this.setState({ expenses: prevExpenses, verifyDelete: false, deleteInfo: {}, savingStatus: true }, () => {
            axios.delete(`/api/deletepayment/${payment_id}`)
                .then(() => this.setState({ savingStatus: false }))
        })
    }

    convertAmount = () => {
        if (this.state.amount) {
            const { amount } = this.state
            let intAmount = convertToRawMoney(amount)
            let filterAmount = convertRawMoney(intAmount)
            this.setState({ amount: filterAmount })
        }
    }

    render() {
        return (
            <div>
                <div className="payment-top-row-container">
                    <div className="row top-row-input">
                        <div className="pay pay-amount">

                            <input
                                className="row-input amount-input"
                                placeholder="$50"
                                value={this.state.amount}
                                onChange={e => this.setState({ amount: e.target.value })}
                                onBlur={() => this.convertAmount()} />

                        </div>

                        <div className="pay pay-date">
                            <DatePicker
                                onChange={e => this.setState({ date: e })}
                                value={this.state.date} />
                        </div>

                        <div className="pay pay-description">

                            <input
                                className="row-input"
                                placeholder="Deposit"
                                value={this.state.description}
                                onChange={e => this.setState({ description: e.target.value })}
                                onKeyDown={e => e.keyCode === 13 ? this.saveExpense() : ''} />

                            <i className="fas fa-plus-square add-pay"
                                onClick={this.saveExpense} />
                        </div>
                    </div>
                </div>

                <Table
                    listData={this.state.expenses}
                    listDataType={"expenses"}
                    updatePayment={this.updatePayment}
                    deletePayment={this.deletePayment}
                    verifyDelete={this.verifyDelete}
                />

                <button className="btn btn-dark save full payment-save-btn"
                    onClick={this.props.clearAndClose}>
                    <p>{this.state.savingStatus ? 'Saving...' : 'Done'}</p>
                </button>

                {/* ---Delete Veriy Modal--- */}
                <Modal open={this.state.verifyDelete} onClose={() => this.setState({ verifyDelete: false, deleteInfo: {} })}>
                    <div className="client-options">

                        <h1 className="client-settings-modal-title">
                            Delete expense of {this.state.deleteInfo.amount}?
                        </h1>

                        <button type="button"
                            className="btn btn-danger options"
                            onClick={this.deleteExpense}>
                            Yes, Delete Expense
                        </button>

                    </div>
                </Modal>
                {/* ---Delete Veriy Modal--- */}

            </div>
        )
    }
}