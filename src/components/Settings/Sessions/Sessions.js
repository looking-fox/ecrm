import React, { Component } from 'react'
import './Sessions.css'
import axios from 'axios'
import { connect } from 'react-redux'
import { updateProps } from '../../../redux/reducer'
import Select from 'react-select'
import Nav from '../Nav/Nav'
import SessionModal from './SessionModal/SessionModal'
import VerifyDeleteModal from './VerifyDeleteModal/VerifyDeleteModal'

const customStyles = {
  container: (provided, state) => ({
    ...provided,
    width: 200,
    height: 'fit-content',
    fontSize: '0.9em',
    lineHeight: 'normal'
  }),
  control: (provided, state) => ({
    ...provided
  }),
  option: (provided, state) => ({
    ...provided,
    padding: 10
  })
}

class Sessions extends Component {
  constructor() {
    super()
    this.state = {
      sessionTypes: [],
      deleteModal: false,
      noSessions: false,
      session: {}
    }
  }

  componentDidMount() {
    //DB request to grab all current session types. 
    //If no session types, display tutorial reminder.
    axios.get('/api/getsessions').then(response => {

      if (response.data[0]) {
        this.setState({ sessionTypes: response.data })
      }
      else {
        this.setState({ noSessions: true })
      }
      this.props.updateProps({ sessionTypes: response.data, listId: -1 })
    })

  }

  componentDidUpdate(prevProps) {
    if (prevProps.sessionTypes !== this.props.sessionTypes) {
      let newTypes = [...this.props.sessionTypes]
      this.setState({ sessionTypes: newTypes }, () => {
        this.hasSessions()
      })
    }
  }

  hasSessions = () => {
    //Hide tutorial if we now have sessions. 
    if (this.state.sessionTypes.length) {
      this.setState({ noSessions: false })
    }
  }

  openModal = (sessionInfo, index) => {
    if (sessionInfo.session_name) {
      let session = { ...sessionInfo, ...{ index } }
      this.props.updateProps({ sessionModal: { open: true, newSession: false, session: session } })
    }
    else {
      this.props.updateProps({ sessionModal: { open: true, newSession: true } })
    }
  }

  closeModal = () => {
    this.setState({ deleteModal: false })
  }

  openVerifyDelete = (item, index) => {
    this.setState({ deleteModal: true, session: { item, index } })
  }

  deleteSession = (item, i) => {
    //Delete session based on session_id
    const { session_id } = item

    axios.delete(`/api/deletesession/${session_id}`).then(() => {
      let tempSessions = this.props.sessionTypes
      tempSessions.splice(i, 1)
      this.props.updateProps({ sessionTypes: tempSessions })

      if (tempSessions.length === 0) {
        this.setState({ sessionTypes: tempSessions, deleteModal: false, noSessions: true })
      }
      else {
        this.setState({ sessionTypes: tempSessions, deleteModal: false })
      }
    })

  }

  render() {
    return (
      <div className="dashboard column">

        <Nav />

        <SessionModal />

        <div className="sessions-dashboard">

          <p className="add" onClick={this.openModal}>
            <i className="fas fa-plus-square" />
            Add Session Template
        </p>
          <div className="session-container">

            {!this.state.noSessions ?

              this.props.sessionTypes.map((e, i) => {
                //Mapping over session types
                //TODO: Needs to be pulled out into separate Session.js component.
                return (
                  <div className="session" key={i}>
                    <div className="session-bubble-container">
                      <div className={`bubble session-type ${e.session_color}`}>
                        <h3>{e.session_name}</h3>
                      </div>
                    </div>
                    <div className="session-price-list">
                      {e.session_price}
                    </div>
                    <div className="steps-bubble">
                      {e.actions.length} steps
                    </div>
                    <Select
                      options={e.actions}
                      value={e.actions[0]}
                      styles={customStyles}
                      isSearchable={false}
                      theme={(theme) => ({
                        ...theme,
                        colors: {
                          ...theme.colors,
                          primary25: '#eeeeee',
                          primary: 'black'
                        },
                      })} />
                    <div className="session-menu center">
                      <i className="far fa-edit"
                        onClick={() => this.openModal(e, i)} />
                      <i className="far fa-trash-alt"
                        onClick={() => this.openVerifyDelete(e, i)} />
                    </div>

                  </div>
                )
              })
              :
              <div className="no-sessions-prompt center column">
                <i className="fas fa-clipboard-list" />
                <h1 className="title"> Time to set up your session templates! </h1>
                <p>
                  Not every client is the same, but most clients are hiring you for a specific package/session. Setting up templates will help speed up your work flow. Once you have a session template, you can add a client list, and add your first client!
              </p>
              </div>
            }
          </div>

        </div>

        <VerifyDeleteModal
          open={this.state.deleteModal}
          close={this.closeModal}
          session={this.state.session}
          deleteSession={this.deleteSession} />


      </div>

    )
  }
}

function mapStateToProps(state) {
  return {
    ...this.props, ...state
  }
}
export default connect(mapStateToProps, { updateProps })(Sessions)