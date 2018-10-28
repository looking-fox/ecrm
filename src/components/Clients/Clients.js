import React, { Component } from 'react'
import './Clients.css'
import Client from '../Client/Client'
import axios from 'axios';


export default class Clients extends Component {
  
  componentDidMount(){
    axios.get('/api/getclients').then(results => {
      console.log("Get Clients: ", results)
    })
  }

  render() {
    return (
      <div className="clientdashboard">
        <Client/>
        <Client/>
        <Client/>
      </div>
    )
  }
}
