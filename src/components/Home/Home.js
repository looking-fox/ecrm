import React, { Component } from 'react'
import './Home.css'
import head from '../../assets/head.jpg'

export default class Home extends Component {
  render() {
    return (
      <div className="app">

        <div className="header">
           <h1 className="logo">R/H</h1>
           <nav>
             <li>PRICING</li>
             <li>FEATURES</li>
             <li>CONTACT</li>
             <button type="button" class="btn btn-sm btn-outline-dark">LOG IN</button>
           </nav>
        </div>

        <div className="body">
            <h3 className="introtext">Photographers, meet your new workspace.</h3>
            <img className ="mainimage" src={head}/>
        </div>
    
      </div>
    )
  }
}
