import React, { Component } from 'react'
import './PaymentModal.css'
import Modal from 'react-responsive-modal'
import PaymentTable from './PaymentTable/PaymentTable'
import ExpenseTable from './ExpenseTable/ExpenseTable'
import MileageTable from './MileageTable/MileageTable'
import { connect } from 'react-redux'
import { updateProps } from '../../../redux/reducer'
import { convertRawMoney } from '../../../Main/MainLogic'

class PaymentModal extends Component {
    constructor() {
        super()
        this.state = {
            paid: 0,
            total: 0,
            totalPaid: 0,
            modalView: 'payments',
            noPayments: false
        }
    }

    //Determine perecent of amount paid vs session price. Update UI.
    updateProgressBar = payments => {
        if (payments) {
            let newPayments = JSON.parse(JSON.stringify(payments))
            const { sessionPrice } = this.props.paymentModal
            let paid = newPayments.reduce((a, b) => {
                a.amount += b.amount
                return a
            }).amount

            let filterSessionPrice = parseInt(sessionPrice.replace(/[$,]+/g, ""))
            let percentage = Math.round(paid / filterSessionPrice * 100)

            this.setState({ paid: percentage, total: filterSessionPrice, totalPaid: paid, noPayments: false })

        }
        else {
            const { sessionPrice } = this.props.paymentModal
            let filterSessionPrice = parseInt(sessionPrice.replace(/[$,]+/g, ""))
            this.setState({ paid: 0, total: filterSessionPrice, noPayments: true })
        }
    }

    changeLists = index => {
        this.setState(state => {
            if (index === 0) {
                return {
                    modalView: "payments"
                }
            } else if (index === 1) {
                return {
                    modalView: "expenses"
                }
            } else {
                return {
                    modalView: "mileage"
                }
            }
        })
    }

    renderTable = () => {
        const { modalView } = this.state
        if (modalView === "payments") {
            return (
                <PaymentTable
                    clientId={this.props.paymentModal.clientId}
                    updateProgressBar={this.updateProgressBar}
                    clearAndClose={this.clearAndClose} />
            )
        }
        else if (modalView === "expenses") {
            return (
                <ExpenseTable
                    clientId={this.props.paymentModal.clientId}
                    clearAndClose={this.clearAndClose} />
            )
        }
        else {
            return (
                <MileageTable
                    clientId={this.props.paymentModal.clientId}
                    clearAndClose={this.clearAndClose} />
            )
        }
    }

    clearAndClose = () => {
        this.setState({
            payments: [],
            paid: 0,
            total: 0,
            amount: '',
            date: new Date(),
            description: '',
            deletePaymentId: null,
            modalView: "payments"
        })
        this.props.updateProps({
            paymentModal: { open: false, clientId: null }
        })
    }

    render() {
        const { open, name, sessionColor } = this.props.paymentModal

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

                    <nav className="modal-menu-bar">
                        <p className="modal-menu-item center"
                            onClick={() => this.changeLists(0)}>Payments</p>
                        <p className="modal-menu-item center"
                            onClick={() => this.changeLists(1)}>Expenses</p>
                        <p className="modal-menu-item center"
                            onClick={() => this.changeLists(2)}>Mileage</p>
                    </nav>


                    {/* Swaps out table views based on menu */}
                    {this.renderTable()}


                </div>

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