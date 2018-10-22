import React, { Component } from 'react'
import './Sessions.css'
import Nav from '../Nav/Nav'
import Actions from '../../Actions/Actions'

export default class Sessions extends Component {

  componentDidMount(){
    //DB request to grab all current session types. 
  }

  render() {
    //Display each session: session info, edit button, delete button
    //Add button 
    //Modal for adding session/editing existing session

    return (
      <div className="dashboard">
        <Nav/>

        <div className="sessionsdashboard">

        <div className="session">

            <div className="sessionmenu">
              <h3>Elopement</h3> 
              <i className="far fa-edit"/>
              <i className="far fa-trash-alt"/>
            </div>

            <div className="actions">
              <Actions/>
            </div>

            
        </div>
        
        
        </div>

        </div>
        
     
    )
  }
}
