import React, { Component } from 'react'
import './Clients.css'
import Client from '../Client/Client'
import Actions from '../Actions/Actions'
import ClientModal from './ClientModal/ClientModal'
import axios from 'axios';

import {connect} from 'react-redux'
import {updateClientModal} from '../../redux/reducer'


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
        //Date picker for Client modal
        

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

              if(this.props.listId === -1) return true
              else {
                return e.list_id===this.props.listId
              } 
              
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

      <ClientModal/>

      </div>
    )
  }
}



function mapStateToProps(state){
  return {
    ...this.props, ...state
  }
}

export default connect(mapStateToProps, {updateClientModal})(Clients)
