import React, { Component } from 'react'
import './Sessions.css'
import Nav from '../Nav/Nav'
import Actions from '../../Actions/Actions'
import Modal from 'react-responsive-modal'
import Input from '@material-ui/core/Input'
import axios from 'axios'

export default class Sessions extends Component {
  constructor(){
    super()
    this.state = {
      open: false,
      name: '',
      action: '',
      price: '',
      color: 'Purple',
      actionList: [
        {"name": "inquired"},
        {"name": "emailed"},
        {"name": "booked!"}
      ], 
      sessions: []
    }
  }

  componentDidMount(){
    //DB request to grab all current session types. 
    this.getSessions()
    
  }

  getSessions(){
    axios.get('/api/getsessions').then(response => {
      this.setState({sessions: response.data})
    })
  }

  addItem = (e) => {
    //Modal list of action items, adding to array
   if(e.key==="Enter"){
     var newList = this.state.actionList
     var newItem = {"name": this.state.action}

     newList.push(newItem)

     this.setState({
       actionList: newList, 
       action: ''
     })
     e.target.value = ''
   }

  }

  deleteItem = (i) => {
    //Modal list of action items, delete from array
    var newList = this.state.actionList
    newList.splice(i, 1)
    this.setState({actionList: newList})
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

  saveSession = () => {
    //Axios call to store session in DB: name, color, price, actionList
    var sessionInfo = {
      name: this.state.name,
      price: this.state.price,
      color: this.state.color,
      actionList: this.state.actionList
    }

    //Need to add a condition to check for user input. If user inputs all fields, make axios.post. Otherwise warn user.
    
    axios.post('/api/storesession', {sessionInfo} ).then(response => {
      //Update state on front end with new session.
      this.getSessions()
    })

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
          autoFocus={true}
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

          {this.state.actionList.map( (e,i) => {
              return (
                <div className="actionitem" id={i}>
            {/* Object.keys(e) returns the keys listed at the element.
            Which is an array with one key value. Currying [0] returns the string value vs. the array of the string value. */}
              <i className="far fa-check-circle"/>{e.name}
              <i className="far fa-trash-alt deleteitem"
              onClick={() => this.deleteItem(i)}/>
                </div>
              )
          })}

          </div>

        </div>

        <footer>
        <button type="button" className="btn btn-primary save" 
        onClick={this.saveSession}
        >Save</button>
        </footer>
        
        </Modal>

        <div className="sessionsdashboard">

        <p className="add" onClick={this.onOpenModal}>
        <i className="fas fa-plus-square"/>
        Add Session
        </p>

        
            {this.state.sessions.map((e,i) => {
             
              return (
              <div className="session">
                <div className="sessionmenu">
                  <h3>{e.session_name}</h3>
                  <i className="far fa-edit"/>
                  <i className="far fa-trash-alt"
                  onClick={() => this.deleteSession(e, i)}/>
                </div>

                <div className="actions">


                <Actions 
                checkValues={false}
                actionList={e}/>

               {/* this.props.actionList["actions"][0]["client_id"] */}


                </div>
              </div>
              )
            })}
        
        
    </div>
    

</div>
        
     
    )
  }
}
