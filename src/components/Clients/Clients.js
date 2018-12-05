import React, { Component } from 'react'
import './Clients.css'
import Client from '../Client/Client'
import Actions from '../Actions/Actions'
import ClientModal from './ClientModal/ClientModal'
import ClientSettingsModal from './ClientSettingsModal/ClientSettingsModal'
import FilterBar from './FilterBar/FilterBar'
import PaymentModal from './PaymentModal/PaymentModal'
import axios from 'axios';
import keyBy from 'lodash.keyby'

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
      sessionPrice: '',
      deleteVerify: false,
      showTutorial: false
    }
    
  }
       
  // MVP:
    //Generate totals paid per client, total paid, total remaining

  //NON-MVP:
        //User icon will be new menu for settings, logout
        //Ability to add multiple "clients" big lists


  componentDidMount(){
      this.getClients()
  }

  componentDidUpdate(prevProps){
      if(prevProps !== this.props){
          //If we change to All Clients--get new clients.
          if(prevProps.listId !== this.props.listId){
            if(this.props.listId === -1){
              this.getClients()
            }
          }
          //If Props.Clients change, update state. 
          else if (prevProps.clients !== this.props.clients) {
            const {clients} = this.props
            this.setState({clients})
          }
      }
  }

  getClients(){
        //IF: we have 0 clients, we want to update noClients to true to conditionally render tutorial animation.

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

    axios.get('/api/getactions').then(response => {
      //keyBy maps session_id as key for actions array
        var actionList = keyBy(response.data, "actions[0][session_id")
        this.props.updateClients({actions: actionList})
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

  openPayments = (info) => {
    const {name, client_id, session_price, session_color} = info
    let newPaymentInfo = {open: true, clientId: client_id, name: name, sessionPrice: session_price, sessionColor: session_color}
    this.props.updateProps({ paymentModal: newPaymentInfo })
  }

  openClientSettingsModal = (client) => {
    this.props.updateClientSettingsModal({
      clientSettingsModal: {open: true, newClient: false,
        client: client}
    })
    
  }

  openClientModal = () => {
    this.props.updateClientModal({clientModalOpen: true})
  }

  optDeleteModal = () => {
    this.setState({deleteVerify: !this.state.deleteVerify})
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
    const {clientSettingsModal} = this.props
    const {sort, sortSession, dateRange} = this.props.filterBar
    
    let firstClient = this.props.clients[0]
    
    if(firstClient){

        if(firstClient.client_id !==null){

          if(this.props.actions[Object.keys(this.props.actions)[0]]){

            return this.props.clients
            //Filter clients based on List ID.
            .filter(e => {
              if(this.props.listId === -1) return true
              else return e.list_id===this.props.listId  
              })
            
            //If actively filtering sessions, filter by session_name. IDs are per client. Name is consistent var for this case. 
            .filter(e => {
              if(sortSession.value !== 0){
                if(e.session_name === sortSession.value) return true
                else return false
              }
              else return true
            })

            .filter(e => {
              if(dateRange.start){
                  const {start, end} = dateRange   // format: ["4", "30", "2018"]
                  let startMonth = parseInt(start[0])
                  let startYear = parseInt(start[2])
                  let endMonth = parseInt(end[0])
                  let endYear = parseInt(end[2])
                  let clientMonth = parseInt(e.date.split("/")[0])
                  let clientYear = parseInt(e.date.split("/")[2])
                  
                  if(clientYear >= startYear && clientYear <= endYear){  
                    if(clientMonth >= startMonth && clientMonth <= endMonth){
                      return true
                    }
                  }
                  else return false
                }

                else return true
            })

            //Sort by date (default) or by name.
            .sort((a,b) => {
              const {value} = sort
                    if(value === 'name'){
                      if(a.name < b.name) return -1
                      else return 1
                    }

                    if(value === 'date'){
                      if(a.date < b.date) return -1
                      else return 1
                    }
            })

            //Sort completed clients to bottom of list
            .sort((a,b) => {
              return a.completed - b.completed
            })

            .map( (e, i) => {    
                
                var id = e.session_id
                var actionList = this.props.actions[id]["actions"]
          
              return e.completed===false ?
                
                  <div className="bar" key={e.client_id}>
            
                        <Client 
                        client={e}
                        index={i}
                        actionList={actionList}
                        goToMap={this.goToMap}
                        openPayments={this.openPayments}
                        openClientModal={this.openClientModal}
                        optDeleteModal={this.optDeleteModal}
                        openClientSettingsModal={this.openClientSettingsModal}/>
            
                        <Actions 
                        id={e.client_id}
                        actionsComplete={e.completed}
                        checkValues={true}
                        allChecked={this.allItemsChecked}
                        actionList={actionList}
                        />
            
                  </div>
              :
             
                  <div className="bar completed" key={e.client_id}>
            
                        <Client 
                        client={e}
                        index={i}
                        actionList={actionList}
                        goToMap={this.goToMap}
                        openPayments={this.openPayments}
                        openClientModal={this.openClientModal}
                        optDeleteModal={this.optDeleteModal}
                        openClientSettingsModal={this.openClientSettingsModal}/>
            
                        <Actions 
                        id={e.client_id}
                        actionsComplete={e.completed}
                        checkValues={true}
                        allChecked={this.allItemsChecked}
                        actionList={actionList}
                        />
            
                  </div>
              })
            }
        }
      }
    if(this.props.noClients) {
      return (
        <div className="no-client-container">
          <i className="fas fa-campground"/>
          <h1>Welcome to Looking Fox!</h1>
          <p>Head on over to tools > templates to get started.</p>
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

        <FilterBar/>


        { this.renderClients() }
      
      
        {/* ------Modals------ */}

              <ClientModal/>

              <ClientSettingsModal {...this.props}
              deleteClient={this.deleteClient}
              optDeleteModal={this.optDeleteModal}
              deleteVerify={this.state.deleteVerify}/>

              <PaymentModal/>

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
