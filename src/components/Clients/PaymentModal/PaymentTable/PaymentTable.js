import React, { Component } from 'react'
import Modal from 'react-responsive-modal'
import DatePicker from 'react-date-picker'
import axios from 'axios'
import Table from '../Table/Table'
import { convertToRawMoney, convertRawMoney } from '../../../../Main/MainLogic'

export default class PaymentTable extends Component {
    constructor() {
        super()
        this.state = {
            payments: [],
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
        axios.get(`/api/getpayments/${clientId}`)
            .then(response => {
                this.setState({ payments: response.data })
            }).then(() => {
                this.props.updateProgressBar(this.state.payments)
            })
    }

    savePayment = () => {
        const { amount, date, description, payments } = this.state

        if (!amount || !description) {
            alert('Please fill in the payment information before adding it.')
            return
        }
        let intAmount = convertToRawMoney(amount)
        const { clientId } = this.props

        this.setState({ savingStatus: true })
        axios.post('/api/savepayment', { amount: intAmount, date, description, clientId })
            .then(response => {
                let prevPayments = [...payments]
                prevPayments.push(response.data[0])

                this.setState({
                    payments: prevPayments,
                    amount: '',
                    date: new Date(),
                    description: '',
                    savingStatus: false
                }, () => this.props.updateProgressBar(this.state.payments))
            })
    }

    updateItem = (newInfo, index) => {
        const { payments } = this.state
        let newPayments = [...payments]
        newPayments[index] = { ...newPayments[index], ...newInfo }

        this.setState({ payments: newPayments, savingStatus: true }, () => {
            axios.put('/api/updatepayment', { payment: newPayments[index] })
                .then(() => this.setState({ savingStatus: false }, () => this.props.updateProgressBar(this.state.payments)))
        })
    }

    verifyDelete = (index, payment) => {
        const { amount, client_id, payment_id } = payment
        let filterAmount = convertRawMoney(amount)
        let deleteInfo = { index, amount: filterAmount, client_id, payment_id }
        this.setState({ verifyDelete: true, deleteInfo })
    }

    deleteItem = () => {
        const { payments, deleteInfo } = this.state
        const { payment_id } = deleteInfo
        let prevPayments = [...payments]
        prevPayments.splice(deleteInfo.index, 1)

        this.setState({ payments: prevPayments, verifyDelete: false, deleteInfo: {}, savingStatus: true }, () => {
            axios.delete(`/api/deletepayment/${payment_id}`)
                .then(() => this.setState({ savingStatus: false }, () => this.props.updateProgressBar(this.state.payments)))
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
            <React.Fragment>
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
                                onKeyDown={e => e.keyCode === 13 ? this.savePayment() : ''} />

                            <i className="fas fa-plus-square add-pay"
                                onClick={this.savePayment} />
                        </div>
                    </div>
                </div>

                <Table
                    listData={this.state.payments}
                    listDataType={"payments"}
                    updateItem={this.updateItem}
                    deleteItem={this.deleteItem}
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
                            Delete payment of {this.state.deleteInfo.amount}?
                        </h1>

                        <button type="button"
                            className="btn btn-danger options"
                            onClick={this.deleteItem}>
                            Yes, Delete Payment
                        </button>

                    </div>
                </Modal>
                {/* ---Delete Veriy Modal--- */}

            </React.Fragment>
        )
    }
}



