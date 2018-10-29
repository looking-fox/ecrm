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
      clientName: ''
    }
  }
  componentDidMount(){
    axios.get('/api/getclients').then(response => {
      this.setState({clients: response.data})
    })
    axios.get('/api/getsessions').then(response => {
      this.setState({
        sessions: response.data,
        sessionPrice: response.data[0].session_price
      })
    })
  }

  sessionPriceUpdater = (index) => {
    this.setState({
      sessionPrice: this.state.sessions[index].session_price
    })
  }

  render() {

    

    return (
      <div className="clientdashboard">
        {this.state.clients.map( (e) => {
          return (
          <div className="bar">

                <Client 
                name={e.name}
                sessionName={e.session_name}
                sessionColor={e.session_color}
                sessionPrice={e.session_price}
                sessionDate={e.date}
                sessionLocation={e.location}/>

                <Actions actionList={e.action_list}/>

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
          placeholder="Client's Name"
          onChange={e => this.setState({clientName: e.target.value})}/>

      <select className="sessionmenu" 
        onChange={e => this.sessionPriceUpdater(e.target.value)}>
              {this.state.sessions.map((e,i) => {
                return (
                <option value={i}> {e.session_name} </option>
                )
              })}
      </select> 

          <Input
          placeholder="Location"
          onChange={e => this.setState({clientName: e.target.value})}/>

          <div className="clientPrice">

          {this.state.sessionPrice}

          </div>

    </div>

    </Modal>

      </div>
    )
  }
}
