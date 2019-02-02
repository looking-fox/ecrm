import React, { Component } from 'react'
import Modal from 'react-responsive-modal'
import DatePicker from 'react-date-picker'
import axios from 'axios'
import Table from '../Table/Table'
import { convertToMiles, convertRawMiles } from '../../../../Main/MainLogic'

export default class MileageTable extends Component {
    constructor() {
        super()
        this.state = {
            mileage: [],
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
        axios.get(`/api/getmileage/${clientId}`)
            .then(response => {
                this.setState({ mileage: response.data })
            })
    }

    saveMileage = () => {
        const { amount, date, description, mileage } = this.state

        if (!amount || !description) {
            alert('Please fill in the mileage information before adding it.')
            return
        }
        let intAmount = convertRawMiles(amount)
        const { clientId } = this.props

        this.setState({ savingStatus: true })
        axios.post('/api/savemileage', { amount: intAmount, date, description, clientId })
            .then(response => {
                let prevMileage = [...mileage]
                prevMileage.push(response.data[0])

                this.setState({
                    mileage: prevMileage,
                    amount: '',
                    date: new Date(),
                    description: '',
                    savingStatus: false
                })
            })
    }

    updateItem = (newInfo, index) => {
        const { mileage } = this.state
        let newMileage = [...mileage]
        newMileage[index] = { ...newMileage[index], ...newInfo }

        this.setState({ mileage: newMileage, savingStatus: true }, () => {
            axios.put('/api/updatemileage', { mileage: newMileage[index] })
                .then(() => this.setState({ savingStatus: false }))
        })
    }

    verifyDelete = (index, mileage) => {
        const { amount, client_id, mileage_id } = mileage
        let filterAmount = convertToMiles(amount)
        let deleteInfo = { index, amount: filterAmount, client_id, mileage_id }
        this.setState({ verifyDelete: true, deleteInfo })
    }

    deleteItem = () => {
        const { mileage, deleteInfo } = this.state
        const { mileage_id } = deleteInfo
        let prevMileage = [...mileage]
        prevMileage.splice(deleteInfo.index, 1)

        this.setState({ mileage: prevMileage, verifyDelete: false, deleteInfo: {}, savingStatus: true }, () => {
            axios.delete(`/api/deletemileage/${mileage_id}`)
                .then(() => this.setState({ savingStatus: false }))
        })
    }

    convertAmount = () => {
        if (this.state.amount) {
            const { amount } = this.state
            let intAmount = convertRawMiles(amount)
            let filterAmount = convertToMiles(intAmount)
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
                                placeholder="50 mi"
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
                                placeholder="Seattle to Port Angeles"
                                value={this.state.description}
                                onChange={e => this.setState({ description: e.target.value })}
                                onKeyDown={e => e.keyCode === 13 ? this.saveMileage() : ''} />

                            <i className="fas fa-plus-square add-pay"
                                onClick={this.saveMileage} />
                        </div>
                    </div>
                </div>

                <Table
                    listData={this.state.mileage}
                    listDataType={"mileage"}
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
                            Delete mileage of {this.state.deleteInfo.amount}?
                        </h1>

                        <button type="button"
                            className="btn btn-danger options"
                            onClick={this.deleteItem}>
                            Yes, Delete Mileage
                        </button>

                    </div>
                </Modal>
                {/* ---Delete Veriy Modal--- */}

            </div>
        )
    }
}