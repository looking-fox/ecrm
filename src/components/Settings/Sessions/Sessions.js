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
      sessions: []
    }
  }

  componentDidMount(){
    //DB request to grab all current session types. 
    this.getSessions()
    
  }

  getSessions =() => {
    axios.get('/api/getsessions').then(response => {
      this.setState({sessions: response.data})
    })
  }

  openModal = (session) => {
    if(session.session_name){
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
    const {sessions} = this.state
    var id = item.session_id
    
    axios.delete(`/api/deletesession/${id}`).then( () => {
      sessions.splice(i, 1)
      this.setState({sessions: sessions})
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
        
            {this.state.sessions.map((e,i) => {
             
              return (
                <div className="session" key={i}>
                    <div className="sessionmenu">
                      <h3>{e.session_name}</h3>
                      <i className="far fa-edit"
                      onClick={() => this.openModal(e)}/>
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