import React, { Component } from 'react'
import './Sessions.css'
import Nav from '../Nav/Nav'
import Actions from '../../Actions/Actions'
import Modal from 'react-responsive-modal';
import Input from '@material-ui/core/Input';

export default class Sessions extends Component {
  constructor(){
    super()
    this.state = {
      open: false,
      name: ''
    }
  }
  componentDidMount(){
    //DB request to grab all current session types. 
  }

  addSession = () => {
   
  }

  onOpenModal = () => {
    this.setState({ open: true });
  };

  onCloseModal = () => {
    this.setState({ open: false });
  };

  render() {
    //Display each session: session info, edit button, delete button
    //Add button 
    //Modal for adding session/editing existing session

    return (
      <div className="dashboard">

        <Nav/>

        <Modal open={this.state.open} onClose={this.onCloseModal} center>
        <div className="sessionform">
          <h3>Add A Session</h3>
          <Input 
          placeholder="Session Name"
          classes={{root: 'inputfield'}}
          onChange={(e) => this.setState({name: e.target.value})}/>
        </div>
        </Modal>

        <div className="sessionsdashboard">

        <p className="add" onClick={this.onOpenModal}>
        <i className="fas fa-plus-square"/>
        Add Session
        </p>

        
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
