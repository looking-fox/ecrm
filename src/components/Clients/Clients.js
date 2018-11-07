import React, { Component } from 'react'
import './Clients.css'
import Client from '../Client/Client'
import Actions from '../Actions/Actions'
import axios from 'axios';
import Modal from 'react-responsive-modal'
import Input from '@material-ui/core/Input'
import {connect} from 'react-redux'


class Clients extends Component {
  constructor(){
    super()
    this.state = {
      clients: [],
      noClients: false,
      sessions: [],
      sessionTypes: [],
      sessionIndex: 0,
      sessionPrice: '',
      open: false,
      clientName: '',
      clientDate: '',
      clientLocation: ''
    }
    
  }

  //TODO AFTER USER TEST: 
        //Color picker needs to work
        //Currency needs to check/add comma + currency
        //Date picker for Client modal
        //Action items for sessions needs to be reset 
        //Client list needs to redirect to dashboard from settings
        //Add symbol next to each client list

  //NON-MVP:
        //Clicking Clients itself--Shows all 
        //User icon will be new menu for settings, logout
        //Drag and drop on session actions
        //Drag and drop on client lists
        //Ability to add multiple "clients" big lists

  componentDidMount(){
    //Separating this out so I can call these actions twice. Trying to be functional at least until I can optimize my DB call to only return new clients. 
    this.getClients()

  }

  componentDidUpdate(prevProps){
//Extra server call that isn't needed. We should separate the mapping function from the axios request to optimize getClients()

    if(prevProps !== this.props){
      this.getClients()
    }
  }

  getClients(){

    axios.get('/api/getclients').then(response => {
      this.setState(() => {
        let firstClient = response.data[0]

        if(firstClient){
              if(firstClient.client_id===null){
                return {
                  clients: response.data,
                  noClients: true
                }
              }
              else return {clients: response.data}
        }
        

      })
    })

    axios.get('/api/getactions').then(response => {
      
      var sessionMap = {}
      response.data.map((e,i) => {
        let stringForm = String(e.actions[0]["client_id"])
        sessionMap[stringForm] = e
      })
      
      this.setState({ sessions: sessionMap })
    
    })

  }

  renderClients(){
    //If we have zero clients, we don't want to map and render the Client or Actions components
   
    let firstClient = this.state.clients[0]
    if(firstClient){

        if(firstClient.client_id !==null){

            return this.state.clients

            .filter(e => {
              return e.list_id===this.props.listId
            })
            
            .map( (e, i) => {
              let sessionInfo = this.state.sessions[e.client_id]
              
              return (
              <div className="bar">
        
                    <Client 
                    name={e.name}
                    sessionName={e.session_name}
                    sessionColor={e.session_color}
                    sessionPrice={e.session_price}
                    sessionDate={e.date}
                    sessionLocation={e.location}/>
        
                    <Actions 
                    checkValues={true}
                    actionList={sessionInfo}/>
        
              </div>
              )
            })
        }
    }
   
    if(this.state.noClients) {
      return (
        <div className="no-client-container">
          <i className="fas fa-campground"/>
          <h1>welcome to basecamp!</h1>
          <p>head on over to settings > sessions to get started</p>
        </div>
      )
    }
    else {
      return (
        <div></div>
      )
    }
    
  }

  openModal = () => {
    axios.get('/api/getsessiontypes').then(response => {
    //If user has no session types, they can't add a client. 
    //If user has no lists, they can't add clients. 
      if(response.data[0]){
          if(response.data[0].session_id !== null){
              if(this.props.lists[0]){

                this.setState({
                  open: true,
                  sessionTypes: response.data,
                  sessionPrice: response.data[0].session_price
                })

              }
          
        }
      }
      //TODO: Different alert statements for no client list or no sessions. 
      else {
      alert("You'll first want to head over to Settings > Sessions and add a few session types.")
           }
      })
  }

  sessionPriceUpdater = (index) => {
    this.setState({
      sessionPrice: this.state.sessionTypes[index].session_price,
      sessionIndex: index
    })
  }

  saveClient = () => {

    var clientObj = {
      name: this.state.clientName,
      sessionId: this.state.sessionTypes[this.state.sessionIndex].session_id,
      date: this.state.clientDate,
      location: this.state.clientLocation,
      listId: this.props.listId
    }

    axios.post('/api/addclient', {clientObj} ).then( () => {
      this.getClients()
      this.setState({open: false})
    })

    //Client is added, modal disappears once complete.
  }

  render() {

    return (
      <div className="clientdashboard">
        { this.renderClients() }
      

          <div className="addclient">

            <i className="fas fa-plus-circle"
            onClick={this.openModal}/>

          </div>

    <Modal 
    open={this.state.open} 
    onClose={() => this.setState({open: false})} center>

    <h3 className="title">
    <i className="far fa-user-circle"/>
    Add Client
    </h3>

    <div className="addclientmodal">
          <Input
          autoFocus={true}
          className="clientinput"
          placeholder="Client's Name"
          onChange={e => this.setState({clientName: e.target.value})}/>

      <select className="sessionmenu" 
        onChange={e => this.sessionPriceUpdater(e.target.value)}>

              {this.state.sessionTypes.map( (e,i) => {
                return (
                  <option value={i}> {e.session_name} </option>
                  )
              })}
              
      </select> 

          <Input
          className="clientinput"
          placeholder="Date"
          onChange={e => this.setState({clientDate: e.target.value})}/>

          <Input
          className="clientinput"
          placeholder="Location"
          onChange={e => this.setState({clientLocation: e.target.value})}/>

          <div className="clientprice"> 
            {this.state.sessionPrice}
          </div>
  
    </div>

        <footer>
        <button type="button" className="btn btn-primary save full" 
        onClick={this.saveClient}
        >+ Add Client</button>
        </footer>

    </Modal>

      </div>
    )
  }
}



function mapStateToProps(state){
  return {
    ...this.props, ...state
  }
}

export default connect(mapStateToProps)(Clients)
