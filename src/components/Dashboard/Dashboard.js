import React, { Component } from 'react'
import axios from 'axios'

import './Dashboard.css'

export default class Dashboard extends Component {

  componentDidMount(){
    axios.get('/api/user-info').then((res) => {
      console.log('response:', res.data)
    })
  }

  render() {
    return (
      <div className="dashboard">
        <div className="sidebar">
        
        </div>
      </div>
    )
  }
}
