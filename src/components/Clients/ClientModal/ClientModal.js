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
            clientName: '',
            clientDate: '2019-06-10',
            clientLocation: ''
        }

    }

    componentDidMount(){
        this.getSessions()

    }

    componentDidUpdate(prevProps){
        if(prevProps !== this.props){
            
            if(this.props.clientSettingsModal.open){
                console.log('updating', this.state)
                this.convertDateToMUI()
                this.isEditingClient()
            }
            
            if(!this.props.clientSettingsModal.open){

                this.setState({
                    clientName: '',
                    clientDate: '2019-06-10',
                    clientLocation: ''
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

    isEditingClient = () => {
       
        const {name, sessionLocation} = this.props.clientSettingsModal.client
        
        this.setState({
            clientName: name,
            clientLocation: sessionLocation
        })
    
    }

    sessionPriceUpdater = (index) => {
        this.setState({
          sessionPrice: this.state.sessionTypes[index].session_price,
          sessionIndex: index
        })
      }

    
      saveClient = () => {

        let date = this.convertDate()
        var clientObj = {
          name: this.state.clientName,
          sessionId: this.state.sessionTypes[this.state.sessionIndex].session_id,
          date: date,
          location: this.state.clientLocation,
          listId: this.props.listId
        }

        if(this.props.clientSettingsModal.client.clientId){
            //Editing and saving client if Id is stored in props.
            const {clientId} = this.props.clientSettingsModal.client
            clientObj['clientId'] = clientId
            axios.put('/api/updateclient', {clientObj}).then(() => {
            this.props.updateClientModal({clientModalOpen: false})
            })
        }

        else {
            //Client is added, modal disappears once complete.

        axios.post('/api/addclient', {clientObj} ).then(() => {
            this.props.updateClientModal({clientModalOpen: false})
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
                          <option value={i}> {e.session_name} </option>
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
    
              <div className="clientprice"> 
                {this.state.sessionPrice}
              </div>
      
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