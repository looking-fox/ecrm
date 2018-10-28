import React, { Component } from 'react'
import './Clients.css'
import Client from '../Client/Client'
import Actions from '../Actions/Actions'
import axios from 'axios';


export default class Clients extends Component {
  constructor(){
    super()
    this.state = {
      clients: []
    }
  }
  componentDidMount(){
    axios.get('/api/getclients').then(response => {
      this.setState({clients: response.data})
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
      </div>
    )
  }
}
