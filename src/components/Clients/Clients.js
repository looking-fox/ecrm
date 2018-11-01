import React, { Component } from 'react'
import './Clients.css'
import Client from '../Client/Client'
import Actions from '../Actions/Actions'
import axios from 'axios';
import Modal from 'react-responsive-modal'
import Input from '@material-ui/core/Input'


export default class Clients extends Component {
  constructor(){
    super()
    this.state = {
      clients: [],
      sessions: [],
      sessionIndex: 0,
      sessionPrice: '',
      open: false,
      clientName: '',
      clientDate: '',
      clientLocation: ''
    }
    
  }
  componentDidMount(){
    axios.get('/api/getclients').then(response => {
      this.setState({clients: response.data})
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

  sessionPriceUpdater = (index) => {
    this.setState({
      sessionPrice: this.state.sessions[index].session_price,
      sessionIndex: index
    })
  }

  saveClient = () => {

    var clientObj = {
      name: this.state.clientName,
      sessionId: this.state.sessions[this.state.sessionIndex].session_id,
      date: this.state.clientDate,
      location: this.state.clientLocation
    }

    axios.post('/api/addclient', {clientObj} ).then( () => {
      this.setState({open: false})
    })

    //Client is added, modal disappears once complete.
    //MISSING: Rerender or update UI with newly added client. 
  }

  render() {

    return (
      <div className="clientdashboard">
        {this.state.clients.map( (e, i) => {
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

                <Actions actionList={sessionInfo}/>

          </div>
          )
        })}

          <div className="addclient">

            <i className="fas fa-plus-circle"
            onClick={() => this.setState({open: true})}/>

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
          className="clientinput"
          placeholder="Client's Name"
          onChange={e => this.setState({clientName: e.target.value})}/>

      <select className="sessionmenu" 
        onChange={e => this.sessionPriceUpdater(e.target.value)}>

              {Object.keys(this.state.sessions).map(e => {
                return (
                  <option value={e.session_id}> {e.session_name} </option>
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
