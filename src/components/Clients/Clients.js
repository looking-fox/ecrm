import React, { Component } from 'react'
import './Clients.css'
import Client from '../Client/Client'
import Actions from '../Actions/Actions'
import ClientModal from './ClientModal/ClientModal'
import ClientSettingsModal from './ClientSettingsModal/ClientSettingsModal'
import axios from 'axios';

import {connect} from 'react-redux'
import {updateClients, updateClientModal, updateClientSettingsModal, updateProps} from '../../redux/reducer'


class Clients extends Component {
  constructor(){
    super()
    this.state = {
      clients: [],
      noClients: false,
      sessions: [],
      sessionTypes: [],
      sessionPrice: ''
    }
    
  }

  //TODO AFTER USER TEST: 
        //Color picker needs to work
        //Currency needs to check/add comma + currency
       
  //NON-MVP:
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
    // if(!prevProps === this.props){
    //   this.getClients()
    // }

  }

  getClients(){
        //IF: we have 0 clients, we want to update noClients to true to conditionally render basecamp animation.

        //ElSE: Async task where we map clientIds to object storing all clients. Then store those clients in Redux.
    axios.get('/api/getclients').then(response => {
        var clients = response.data
        
        let firstClient = response.data[0]
        if(firstClient){
              if(firstClient.client_id===null){
                this.props.updateClients({noClients: true})
              }
              else {
                this.props.updateClients({ clients })
              }
        }
                 
    })

    // axios.get('/api/getdefaultsessions').then(response => {
    //   var sessionPromise = new Promise(resolve => {
    //     var sessionMap = {}

    //     response.data.map((e,i) => {
    //       let stringForm = String(e.session_id)
    //       sessionMap[stringForm] = e
    //     })

    //     resolve(sessionMap)
    //   })
    //   sessionPromise.then(value => {
    //     this.props.updateProps({sessions: value})
    //   })
    // })


    axios.get('/api/getactions').then(response => {
      
      var actionPromise = new Promise(resolve => {
        var actionMap = {}
       
        response.data.map((e,i) => {
          //Set clientId as Key for actionMap object.
          let stringForm = String(e.actions[0]["session_id"])
          actionMap[stringForm] = e
        })
        resolve(actionMap)
      })

      actionPromise.then((value) => {
        this.props.updateClients({actions: value})
      })
      
      
    
    })

  }

  goToMap = (location) => {
    //Format for Google URL String and Open in New Tab
    var convertedLocation = location
        .replace(/[,]+/g, "")
        .replace(/[ ]+/g, "+")
        .replace(/[&]+/g, "%26")

    let url = `https://www.google.com/maps/place/${convertedLocation}`

    window.open(url, '_blank')
  }

  openClientSettingsModal = (client) => {
    this.props.updateClientSettingsModal({
      clientSettingsModal: {open: true, 
        client: client}
    })
  }

  deleteClient = (clientId) => {
    let currentSessions = this.state.sessions
    delete currentSessions[clientId]
    this.setState({sessions: currentSessions})
  }

  allItemsChecked = (clientId, value) => {
    var index = this.props.clients.findIndex(element => {
      return element.client_id === clientId
    })
    var updatedClients = this.props.clients.slice()
    updatedClients[index]["completed"] = value

    this.props.updateClients({ clients: updatedClients })
  }

  renderClients(){
    //If we have zero clients, we don't want to map and render the Client or Actions components
   
    let firstClient = this.props.clients[0]
    
    if(firstClient){

        if(firstClient.client_id !==null){

            return this.props.clients

            .filter(e => {

              if(this.props.listId === -1) return true
              else {
                return e.list_id===this.props.listId
              } 
              
            })

            .sort((a,b) => {
              return a.completed - b.completed
            })
            
            .map( (e, i) => {    
              if(this.props.actions[Object.keys(this.props.actions)[0]]){
                var id = e.session_id
                var actionList = this.props.actions[id]["actions"]
              }

              if(e.completed===false){
                return (
                  <div className="bar" key={e.client_id}>
            
                        <Client 
                        name={e.name}
                        index={i}
                        clientId={e.client_id}
                        sessionName={e.session_name}
                        sessionColor={e.session_color}
                        sessionPrice={e.session_price}
                        sessionId={e.session_id}
                        sessionDate={e.date}
                        sessionLocation={e.location}
                        actionList={actionList}
                        goToMap={this.goToMap}
                        openClientSettingsModal={this.openClientSettingsModal}/>
            
                        <Actions 
                        id={e.client_id}
                        actionsComplete={e.completed}
                        checkValues={true}
                        allChecked={this.allItemsChecked}
                        actionList={actionList}
                        />
            
                  </div>
                  )
              }
              else {
                return (
                  <div className="bar completed" key={e.client_id}>
            
                        <Client 
                        name={e.name}
                        index={i}
                        clientId={e.client_id}
                        sessionName={e.session_name}
                        sessionColor={e.session_color}
                        sessionPrice={e.session_price}
                        sessionId={e.session_id}
                        sessionDate={e.date}
                        sessionLocation={e.location}
                        actionList={actionList}
                        goToMap={this.goToMap}
                        openClientSettingsModal={this.openClientSettingsModal}/>
            
                        <Actions 
                        id={e.client_id}
                        actionsComplete={e.completed}
                        checkValues={true}
                        allChecked={this.allItemsChecked}
                        actionList={actionList}
                        />
            
                  </div>
                  )
              }
              
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
    this.props.updateClientModal({clientModalOpen: true})
  }



  render() {
    
    return (
      <div className="clientdashboard">

        { this.renderClients() }
      
          <div className="addclient">

            <i className="fas fa-plus-circle"
            onClick={this.openModal}/>

          </div>

        {/* ------Modals------ */}

              <ClientModal/>

              <ClientSettingsModal {...this.props}
              deleteClient={this.deleteClient}/>


        {/* ------Modals------ */}

      </div>
    )
  }
}



function mapStateToProps(state){
  return {
    ...this.props, ...state
  }
}

export default connect(mapStateToProps, {updateClients, updateClientModal, updateClientSettingsModal, updateProps})(Clients)
