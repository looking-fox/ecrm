import React, { Component } from 'react'
import './PaymentModal.css'
import Modal from 'react-responsive-modal'
import Table from './Table/Table'
import DatePicker from 'react-date-picker'
import axios from 'axios'
import { connect } from 'react-redux'
import { updateProps } from '../../../redux/reducer'
import { convertToRawMoney, convertRawMoney } from '../../../Main/MainLogic'


class PaymentModal extends Component {
    constructor() {
        super()
        this.state = {
            listData: [],
            payments: [],
            expenses: [],
            paid: 0,
            total: 0,
            totalPaid: 0,
            modalView: 'expenses',
            amount: '',
            date: new Date(),
            description: '',
            noPayments: false,
            verifyDelete: false,
            deleteInfo: {},
            savingStatus: false
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.paymentModal !== this.props.paymentModal) {
            const { clientId } = this.props.paymentModal

            axios.get(`/api/getpayments/${clientId}`).then(response => {
                this.setState({ payments: response.data, listData: response.data })
                this.updateProgressBar()
            })
        }
    }

    //Determine perecent of amount paid vs session price. Update UI.
    //currentPayments makes deep copy of [{}] to avoid changing state.
    updateProgressBar = () => {
        if (this.state.payments[0]) {
            const { sessionPrice } = this.props.paymentModal
            let currentPayments = JSON.parse(JSON.stringify(this.state.payments.slice()))

            let paid = currentPayments.reduce((a, b) => {
                a.amount += b.amount
                return a
            }).amount

            let filterSessionPrice = parseInt(sessionPrice.replace(/[$,]+/g, ""))
            let percentage = Math.round(paid / filterSessionPrice * 100)

            this.setState({ paid: percentage, total: filterSessionPrice, totalPaid: paid, noPayments: false, savingStatus: false })

        }
        else {
            const { sessionPrice } = this.props.paymentModal
            let filterSessionPrice = parseInt(sessionPrice.replace(/[$,]+/g, ""))
            this.setState({ paid: 0, total: filterSessionPrice, noPayments: true })
        }
    }

    convertAmount = () => {
        if (this.state.amount) {
            const { amount } = this.state
            let intAmount = convertToRawMoney(amount)
            let filterAmount = convertRawMoney(intAmount)
            this.setState({ amount: filterAmount })
        }
    }

    savePayment = () => {
        const { amount, date, description, payments } = this.state

        if (!amount || !description) {
            alert('Please fill in the payment information before adding it.')
            return
        }
        let intAmount = convertToRawMoney(amount)
        const { clientId } = this.props.paymentModal

        axios.post('/api/savepayment', { amount: intAmount, date, description, clientId })
            .then(response => {
                let prevPayments = [...payments]
                prevPayments.push(response.data[0])

                this.setState({
                    payments: prevPayments,
                    amount: '',
                    date: new Date(),
                    description: ''
                }, () => this.updateProgressBar())
            })
    }

    updatePayment = (newInfo, index) => {
        const { payments } = this.state
        let newPayments = [...payments]
        newPayments[index] = { ...newPayments[index], ...newInfo }

        this.setState({ payments: newPayments, savingStatus: true }, () => {
            axios.put('/api/updatepayment', { payment: newPayments[index] })
                .then(() => this.updateProgressBar())
        })
    }

    verifyDelete = (index, payment) => {
        const { amount, client_id, payment_id } = payment
        let filterAmount = convertRawMoney(amount)
        let deleteInfo = { index, amount: filterAmount, client_id, payment_id }
        this.setState({ verifyDelete: true, deleteInfo })
    }

    deletePayment = () => {
        const { payments, deleteInfo } = this.state
        const { payment_id } = deleteInfo
        let prevPayments = [...payments]
        prevPayments.splice(deleteInfo.index, 1)

        this.setState({ payments: prevPayments, verifyDelete: false, deleteInfo: {}, savingStatus: true }, () => {
            axios.delete(`/api/deletepayment/${payment_id}`)
                .then(() => this.updateProgressBar())
        })
    }

    changeDate = date => {
        this.setState({ date })
    }

    changeLists = index => {
        this.setState(state => {
            if (index === 0) {
                return {
                    listData: state.payments,
                    modalView: "payments"
                }
            } else if (index === 1) {
                return {
                    listData: state.expenses,
                    modalView: "expenses"
                }
            } else {
                return {
                    listData: state.payments,
                    modalView: "payments"
                }
            }
        })
    }

    isReturnKey = e => {
        if (e.keyCode === 13) this.savePayment()
    }

    clearAndClose = () => {
        this.setState({
            payments: [],
            paid: 0,
            total: 0,
            amount: '',
            date: new Date(),
            description: '',
            deletePaymentId: null
        })
        this.props.updateProps({
            paymentModal: { open: false, clientId: null }
        })
    }

    render() {
        const { open, name, sessionColor } = this.props.paymentModal
        const { modalView, listData } = this.state
        return (
            <Modal open={open} onClose={this.clearAndClose}>
                <div className="client-payment-container align-center column">
                    <h3 className="title">
                        <i className="far fa-credit-card" />
                        {name}
                    </h3>

                    <div className="progress-bar">

                        {this.state.noPayments ?
                            <div className="no-progress center">
                                No Payments
                            </div>
                            :
                            <div className={`progress-completed center ${sessionColor}`}
                                style={{ width: `${this.state.paid}%` }}>
                                <p>{convertRawMoney(this.state.totalPaid)}</p>
                                <p>/</p>
                                <p> {convertRawMoney(this.state.total)} </p>
                            </div>
                        }

                    </div>

                    <div className="modal-menu-bar">
                        <p className="modal-menu-item center"
                            onClick={() => this.changeLists(0)}>Payments</p>
                        <p className="modal-menu-item center"
                            onClick={() => this.changeLists(1)}>Expenses</p>
                        <p className="modal-menu-item center"
                            onClick={() => this.changeLists(2)}>Mileage</p>
                    </div>

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
                                    onChange={e => this.changeDate(e)}
                                    value={this.state.date} />
                            </div>

                            <div className="pay pay-description">

                                <input
                                    className="row-input"
                                    placeholder="Deposit"
                                    value={this.state.description}
                                    onChange={e => this.setState({ description: e.target.value })}
                                    onKeyDown={e => this.isReturnKey(e)} />

                                <i className="fas fa-plus-square add-pay"
                                    onClick={this.savePayment} />
                            </div>
                        </div>
                    </div>

                    {/* Swaps out table views based on menu */}
                    <Table
                        listData={listData}
                        listDataType={modalView}
                        updatePayment={this.updatePayment}
                        deletePayment={this.deletePayment}
                        verifyDelete={this.verifyDelete}
                    />


                    <button className="btn btn-dark save full payment-save-btn"
                        onClick={this.clearAndClose}>
                        <p>{this.state.savingStatus ? 'Saving...' : 'Done'}</p>
                    </button>

                </div>

                <Modal open={this.state.verifyDelete} onClose={() => this.setState({ verifyDelete: false, deleteInfo: {} })}>
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

function mapStateToProps(state) {
    return {
        ...this.props, ...state
    }
}

export default connect(mapStateToProps, { updateProps })(PaymentModal)