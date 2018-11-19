import React, { Component } from 'react'
import './Sessions.css'
import axios from 'axios'
import {connect} from 'react-redux'
import { updateProps } from '../../../redux/reducer'

import Nav from '../Nav/Nav'
import Actions from '../../Actions/Actions'
import SessionModal from './SessionModal/SessionModal'

class Sessions extends Component {
  constructor(){
    super()
    this.state = {
      sessionTypes: []
    }
  }

  componentDidMount(){
    //DB request to grab all current session types. 
    axios.get('/api/getsessions').then(response => {
      this.props.updateProps({sessionTypes: response.data})
      this.setState({sessionTypes: response.data})
    })
    
  }

  openModal = (sessionInfo, index) => {
    if(sessionInfo.session_name){
      let session = {...sessionInfo, ...{ index } }
      this.props.updateProps({sessionModal: {open: true, new: false, session: session} })
    }
    else {
      this.props.updateProps({sessionModal: {open: true, new: true, session: {} }})
    }
  }

  editSession = (id) => {
    alert(`Id of Client: ${id}`)
  }

  deleteSession = (item, i) => {
    //Delete session based on id which we get from sessions[index]
    const {session_id} = this.props.sessionTypes[i]
    
    axios.delete(`/api/deletesession/${session_id}`).then( () => {
      let tempSessions = this.props.sessionTypes
      tempSessions.splice(i, 1)
      this.props.updateProps({ sessionTypes: tempSessions })
      this.setState({sessionTypes: tempSessions})
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
        Add Session
        </p>
        
            {this.props.sessionTypes.map((e,i) => {
             
              return (
                <div className="session" key={i}>
                    <div className="sessionmenu">
                  <div className={`bubble session-type ${e.session_color}`}>
                      <h3>{e.session_name}</h3>
                    </div>
                      <i className="far fa-edit"
                      onClick={() => this.openModal(e, i)}/>
                      <i className="far fa-trash-alt"
                      onClick={() => this.deleteSession(e, i)}/>
                    </div>

                    <div className="actions">

                        <Actions 
                        checkValues={false}
                        actionList={e.actions}/>

                    </div>
              </div>
              )
            })}
        
        </div>
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