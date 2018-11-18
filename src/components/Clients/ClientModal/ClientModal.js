import React, { Component } from 'react'
import './ClientModal.css'
import Modal from 'react-responsive-modal'
import Input from '@material-ui/core/Input'
import TextField from '@material-ui/core/TextField'
import {connect} from 'react-redux'
import {updateClientModal} from '../../../redux/reducer'
import axios from 'axios'

class ClientModal extends Component {
    constructor(){
        super()

        this.state = {
            sessionTypes: [],
            sessionIndex: 0,
            sessionPrice: '',
            sessionId: '',
            clientName: '',
            clientDate: '2019-06-10',
            clientLocation: '',
            togglePriceEdit: false
        }

    }

    componentDidMount(){
        this.getSessions()
    }

    componentDidUpdate(prevProps){
        if(prevProps !== this.props){
            this.getSessions()

            if(this.props.clientSettingsModal.open){
                this.convertDateToMUI()
                this.isEditingClient()
            }
            
            if(!this.props.clientSettingsModal.open){
                    this.setState({
                        sessionTypes: [],
                        sessionIndex: 0,
                        sessionPrice: '',
                        sessionId: '',
                        clientName: '',
                        clientDate: '2019-06-10',
                        clientLocation: '',
                        togglePriceEdit: false
                    })  
            }
            
        } 
    }

    getSessions = () => {
        axios.get('/api/getsessiontypes').then(response => {

            //If user has no session types, they can't add a client. 
            //If user has no lists, they can't add clients. 
            if(response.data[0]){
                  if(response.data[0].session_id !== null){
                      if(this.props.lists){
                            this.setState({
                            sessionTypes: response.data,
                            sessionPrice: response.data[0].session_price,
                            sessionId: response.data[0].session_id
                            })
                      }       
                  }
              }

            //If user is editing a previous client, update State to reflect their sessionPrice--not the default session price.
            if(this.props.clientSettingsModal.open){
                 this.isEditingClient()
            }
            else {
                if(!this.props.clients[0]){
                    if(!this.props.clients[0]["client_id"])
                    alert("You'll first want to head over to Settings > Sessions and add a few session types.")
                }
            }
         })
    }

    isEditingClient = () => {
       //Updates local state with Client variables, if editing.
        const {name, sessionLocation, sessionPrice, sessionId} = this.props.clientSettingsModal.client
        
        this.setState({
            clientName: name,
            clientLocation: sessionLocation,
            sessionPrice: sessionPrice,
            sessionId: sessionId
        })
    
    }

    sessionPriceUpdater = (index) => {
        this.setState({
          sessionPrice: this.state.sessionTypes[index].session_price,
          sessionIndex: index,
          sessionId: this.state.sessionTypes[index].session_id
        })
      }

    
      saveClient = () => {
        
        let date = this.convertDate()
        
        var clientInfo = {
            name: this.state.clientName,
            date: date,
            location: this.state.clientLocation,
            session_price: this.state.sessionPrice,
            list_id: this.props.listId
        }
       
        if(this.props.clientSettingsModal.open){
            //Editing and saving client if Id is stored in props.
            const {clientId, sessionId, actionList} = this.props.clientSettingsModal.client
            var index; 
        
            clientInfo["client_id"] = clientId
            clientInfo["session_id"] =  sessionId
            clientInfo["actions"] = actionList

            this.props.clients.map((e,i) => {
                if(e.client_id === clientId){
                    index = i
                    return
                }
            })

            var newClient = Object.assign({}, this.props.clients[index],clientInfo)

            var allClients = this.props.clients
            allClients.splice(index, 1, newClient)
           
            axios.put('/api/updateclient', {clientInfo}).then(() => {
                this.props.updateClientModal({
                  clientModalOpen: false,
                  clientSettingsModal: { open: false, client: {} },
                  clients: allClients
                })
            })
        }

        else {
            //Client added to DB. Receive new Client (w/ ID) and client's actions. Updating front end via props.
            // session_name, session_color, actions, session_price
            const {session_name, session_color, actions} = this.state.sessionTypes[this.state.sessionIndex]
            
            clientInfo["session_name"] = session_name
            clientInfo["session_color"] = session_color
            clientInfo["actions"] = actions

            axios.post('/api/addclient', {clientInfo} ).then( response => {
                var allClients = this.props.clients
                var newClient = response.data.client[0]
                allClients.push(newClient)

                const {session_id} = response.data.client[0]
                var allActions = this.props.actions
                var Id = String(session_id)
                allActions[Id] = { actions: response.data.actions[0]["actions"] }

                this.props.updateClientModal({
                    clientModalOpen: false,
                    clients: allClients, 
                    actions: allActions
                })
            })
        }
 
    }

    //Convert Material UI format to display format for User.
    //TODO: Use regex to remove front zero
    convertDate = () => {
        let date = this.state.clientDate.split('-')
        let year = date.shift()
        date.push(year)
        date = date.join('/')
        return date
    }

    //Convert DB date to MUI for user display.
    convertDateToMUI = () => {
        const {sessionDate} = this.props.clientSettingsModal.client

        var newString = sessionDate.replace(/[/]+/g, "-").split('-')
        var year = newString.pop()
        newString.unshift(year)
        newString = newString.join("-")

        this.setState({clientDate: newString})
    }

    closeAndResetModal = () => {

        this.props.updateClientModal({clientModalOpen: false})
                            
    }

    toggleEdit = () => {
        this.setState({togglePriceEdit: !this.state.togglePriceEdit})
    }

    
    
  render() {
    return (
        <Modal 
        open={this.props.clientModalOpen} 
        onClose={this.closeAndResetModal} center>
    
        <h3 className="title">
        <i className="far fa-user-circle"/>
        {this.props.clientSettingsModal.open ? 
            "Update Client" : "Add Client"}
        </h3>
    
        <div className="addclientmodal">
              <Input
              autoFocus={true}
              className="clientinput"
              placeholder="Client's Name"
              defaultValue={this.state.clientName}
              onChange={e => this.setState({clientName: e.target.value})}/>
    
          {
            //If new client, render session type dropdown.
            (() => {
              if(!this.props.clientSettingsModal.client.clientId){
                return (
                <select className="sessionmenu" 
                onChange={e => this.sessionPriceUpdater(e.target.value)}>
        
                      {this.state.sessionTypes.map( (e,i) => {
                        return (
                          <option value={i} key={e.session_id}>         {e.session_name} 
                          </option>
                          )
                      })}
                      
              </select> 
                )
              }
          })()
          }
    

            <TextField
            id="date"
            label="Date"
            type="date"
            defaultValue={this.state.clientDate}
            onChange={e => this.setState({clientDate: e.target.value})}
            InputLabelProps={{
            shrink: true, }} />
    
              <Input
              className="clientinput"
              placeholder="Location"
              defaultValue={this.state.clientLocation}
              onChange={e => this.setState({clientLocation: e.target.value})}/>
    

              
            {this.state.togglePriceEdit ? 

            <Input className="clientinput"
            placeholder={this.state.sessionPrice}
            defaultValue={this.state.sessionPrice}
            onBlur={this.toggleEdit}
            onChange={e => this.setState({sessionPrice: e.target.value})}/>
            :
            <div className="clientprice" onClick={this.toggleEdit}> 
             {this.state.sessionPrice}
            </div> 
            
            }
                  
              
                  

      
        </div>
    
            <footer>

            <button type="button" 
            className="btn btn-primary save full" 
            onClick={this.saveClient}>

            {this.props.clientSettingsModal.open ? 
            "Save Client" : "+ Add Client"}

            </button>
            </footer>
    
        </Modal>
    )
  }
}


function mapStateToProps(state){
    return {
        ...this.props, ...state
    }
}
export default connect(mapStateToProps, {updateClientModal})(ClientModal)