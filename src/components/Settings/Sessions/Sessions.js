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
      name: '',
      action: '',
      price: '',
      color: 'Purple',
      actionList: {
        "inquired": false,
        "responded": false,
        "set up meeting": false
      }
    }
  }
  componentDidMount(){
    //DB request to grab all current session types. 
  }

  addItem = (e) => {
   if(e.key==="Enter"){
     var newList = this.state.actionList
     newList[this.state.action] = false
     this.setState({
       actionList: newList, 
       action: ''
     })
     e.target.value = ''
   }

  }

  saveSession = () => {
    //Axios call to store session in DB: name, color, price, actionList
    this.onCloseModal()
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
        <h3 className="title">Add A Session</h3>
        <div className="sessionform">
          

          <div className="sessioninfo">
          <Input 
          placeholder="Session Name"
          fullWidth={true}
          classes={{ root: 'input' }}
          onChange={e => this.setState({name: e.target.value})}/>

          <select className="colormenu" 
          onChange={e => this.setState({color: e.target.value})}>
              <option value="Purple">Purple</option>
              <option value="Blue">Blue</option>
              <option value="Red">Red</option>
              <option value="Green">Green</option>
              <option value="Orange">Orange</option>
              <option value="Gray">Gray</option>
          </select>  

          <Input 
          placeholder="Price ($1,000)"
          fullWidth={true}
          onChange={e => this.setState({price: e.target.value})}/>

          </div>

          <div className="actioninfo">

          <Input 
          placeholder="Add Action"
          fullWidth={true}
          // classes={{root: 'inputfield'}}
          onChange={e => this.setState({action: e.target.value})}
          onKeyDown={e => this.addItem(e)}
          />

          {Object.keys(this.state.actionList).map( (e,i) => {
              return (
                <div className="actionitem" id={i}>
                  <i className="far fa-check-circle"/>{e}
                </div>
              )
          })}

          </div>

        </div>

        <footer>
        <button type="button" class="btn btn-primary save" 
        onClick={this.saveSession}
        >Save</button>
        </footer>
        
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
