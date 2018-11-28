import React, { Component } from 'react'
import './Sessions.css'
import axios from 'axios'
import {connect} from 'react-redux'
import { updateProps } from '../../../redux/reducer'

import Nav from '../Nav/Nav'
import Actions from '../../Actions/Actions'
import SessionModal from './SessionModal/SessionModal'
import VerifyDeleteModal from './VerifyDeleteModal/VerifyDeleteModal'

class Sessions extends Component {
  constructor(){
    super()
    this.state = {
      sessionTypes: [],
      deleteModal: false,
      noSessions: false,
      session: {}
    }
  }

  componentDidMount(){
    //DB request to grab all current session types. 
    //If no session types, display tutorial reminder.
    axios.get('/api/getsessions').then(response => {
      if(response.data[0]){
        this.setState({sessionTypes: response.data[0]})
      }
      else {
        this.setState({ noSessions: true })
      }

      this.props.updateProps({sessionTypes: response.data})
    })
    
  }

  componentDidUpdate(prevProps){
      if(prevProps.sessionTypes !== this.props.sessionTypes){
          var newTypes = this.props.sessionTypes.slice()
          this.setState({ sessionTypes: newTypes })
      }
    } 

  openModal = (sessionInfo, index) => {
    if(sessionInfo.session_name){
      let session = {...sessionInfo, ...{ index } }
      this.props.updateProps({sessionModal: {open: true, newSession: false, session: session} })
    }
    else {
      this.props.updateProps({sessionModal: {open: true, newSession: true }})
    }
  }

  closeModal = () => {
    this.setState({deleteModal: false})
  }

  openVerifyDelete = (item, index) => {
    this.setState({ deleteModal: true, session: {item, index}  })
  }

  editSession = (id) => {
    alert(`Id of Client: ${id}`)
  }

  deleteSession = (item, i) => {
    //Delete session based on session_id
    const {session_id} = item
    
    axios.delete(`/api/deletesession/${session_id}`).then( () => {
      let tempSessions = this.props.sessionTypes
      tempSessions.splice(i, 1)
      this.props.updateProps({ sessionTypes: tempSessions })
        
        if(tempSessions.length === 0){
          this.setState({sessionTypes: tempSessions, deleteModal: false, noSessions: true})
        }
        else {
        this.setState({sessionTypes: tempSessions, deleteModal: false})
        }
    })
    
  }

  render() {
    //Display each session: session info, edit button, delete button
    //Add button 
    //Modal for adding session/editing existing session

    return (
      <div className="dashboard">

        <Nav/>

        <SessionModal/>

        <div className="sessionsdashboard">

        <p className="add" onClick={this.openModal}>
        <i className="fas fa-plus-square"/>
        Add Session Template
        </p>
        <div className="session-container"> 

            {!this.state.noSessions ? 

              this.props.sessionTypes.map((e,i) => {
             
              return (
                <div className="session" key={i}>
                    <div className="sessionmenu">
                  <div className={`bubble session-type ${e.session_color}`}>
                      <h3>{e.session_name}</h3>
                    </div>
                      <i className="far fa-edit"
                      onClick={() => this.openModal(e, i)}/>
                      <i className="far fa-trash-alt"
                      onClick={() => this.openVerifyDelete(e,i)}/>
                    </div>

                    <div className="actions">

                        <Actions 
                        checkValues={false}
                        actionList={e.actions}/>

                    </div>
              </div>
              )
            })
          :
          <div className="no-sessions-prompt">
              <i className="fas fa-clipboard-list"/>
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
        deleteSession={this.deleteSession}/>


    </div>
        
    )
  }
}

function mapStateToProps(state){
  return {
      ...this.props, ...state
  }
}
export default connect(mapStateToProps, {updateProps} )(Sessions)