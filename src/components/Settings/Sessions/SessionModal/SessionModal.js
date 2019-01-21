import React, { Component } from 'react'
import './SessionModal.css'
import ActionList from './ActionList/ActionList'
import Modal from 'react-responsive-modal'
import axios from 'axios'
import { connect } from 'react-redux'
import { updateProps } from '../../../../redux/reducer'
import { DragDropContext } from 'react-beautiful-dnd'
import { convertRawMoney, convertToRawMoney } from '../../../../Main/MainLogic'

class SessionModal extends Component {
    constructor() {
        super()
        this.state = {
            name: '',
            price: '',
            color: 'Blue'
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.sessionModal.open !== this.props.sessionModal.open) {
            const { sessionModal } = this.props

            if (sessionModal.session) {
                if (sessionModal.session.session_name) {
                    const { session_name, session_price, session_color } = this.props.sessionModal.session
                    this.setState({
                        name: session_name,
                        price: session_price,
                        color: session_color
                    })
                }
            }
        }
    }

    onDragEnd = result => {
        const { destination, source, draggableId } = result

        //If dropped outside droppable or same index just return
        if (!destination) return
        if (destination.droppableId === source.droppableId &&
            destination.index === source.index) return

        //Else splice and move to new position & update props
        let movingItem = this.props.currentActions[draggableId]
        var newList = this.props.currentActions
        newList.splice(source.index, 1)
        newList.splice(destination.index, 0, movingItem)

        this.props.updateProps({ currentActions: newList })

    }

    saveSession = () => {
        //Axios call to store session in DB: name, color, price, actionList

        const { currentActions } = this.props
        var sessionInfo = {
            name: this.state.name,
            price: this.state.price,
            color: this.state.color,
            actionList: JSON.parse(JSON.stringify(currentActions))
        }

        if (this.props.sessionModal.newSession === true) {
            //If new client
            axios.post('/api/storesession', { sessionInfo })
                .then(response => {
                    var newSessions = this.props.sessionTypes.slice()
                    newSessions.push(response.data[0])
                    this.props.updateProps({ sessionTypes: newSessions })

                    this.onCloseModal()
                })
        }
        else {
            //If updating previous client

            const newSessions = this.getNewActions()
            this.props.updateProps({ sessionTypes: newSessions })

            const { session_id } = this.props.sessionModal.session
            sessionInfo = addId(session_id)

            axios.put('/api/updatesession', { sessionInfo })
                .then(() => this.onCloseModal())

            function addId(id) {
                return { ...sessionInfo, ...{ session_id: id } }
            }

        }

    }

    onCloseModal = () => {
        //Props function to close modal and clear form on state
        this.setState({
            name: '',
            price: '',
            color: 'Blue'
        })
        this.props.updateProps({
            sessionModal:
                { open: false, newSession: false },
            currentActions: [{ label: 'inquired', value: 'inquired' },
            { label: 'sent online guide', value: 'sent online guide' },
            { label: 'booked!', value: 'booked!' }]
        })
    };

    getNewActions = () => {
        //Returns new sessionType with updated actions
        const { index } = this.props.sessionModal.session
        let tempSessions = this.props.sessionTypes.slice()
        const list = this.props.currentActions
        tempSessions[index]["actions"] = list
        return tempSessions
    }

    convertAmount = () => {
        let intAmount = convertToRawMoney(this.state.price)
        let filterAmount = convertRawMoney(intAmount)
        this.setState({ price: filterAmount })
    }


    render() {
        const { sessionModal } = this.props

        return (
            <Modal open={sessionModal.open} onClose={this.onCloseModal} center>
                {sessionModal.new ?
                    <p className="session-title">
                        Add A Session
                </p>
                    :
                    <h3 className="title">
                        <div className="bubble-container">
                            <div className={`bubble-display bubble ${this.state.color}`}>
                                {this.state.name}
                            </div>
                        </div>
                    </h3>}

                <div className="session-form">

                    <div className="session-info">

                        <input
                            className="input-box" autoFocus
                            placeholder="Session Name"
                            value={this.state.name}
                            onChange={e => this.setState({ name: e.target.value })}
                        />

                        <select className="color-menu"
                            value={this.state.color}
                            onChange={e => this.setState({ color: e.target.value })}>
                            <option value="Blue">Blue</option>
                            <option value="LightBlue">Light Blue</option>
                            <option value="Green">Green</option>
                            <option value="LightGreen">Light Green</option>
                            <option value="Goldenrod">Goldenrod</option>
                            <option value="Sandstone">Sandstone</option>
                        </select>

                        <input
                            className="input-box"
                            placeholder="Price ($1,000)"
                            value={this.state.price}
                            onChange={e => this.setState({ price: e.target.value })}
                            onBlur={this.convertAmount}
                        />

                    </div>

                    <div className="session-action-panel">
                        <DragDropContext onDragEnd={this.onDragEnd}>
                            <ActionList />
                        </DragDropContext>
                    </div>

                </div>

                <footer className="session-footer">
                    <button type="button" className="btn btn-primary save full" onClick={this.saveSession}
                    >Save</button>
                </footer>

            </Modal>
        )
    }
}
function mapStateToProps(state) {
    return {
        ...this.props, ...state
    }
}
export default connect(mapStateToProps, { updateProps })(SessionModal)
