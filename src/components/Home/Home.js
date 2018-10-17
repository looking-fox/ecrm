import React, { Component } from 'react'
import './Home.css'
import head from '../../assets/head.jpg'
import Features from '../Features/Features'

export default class Home extends Component {
  render() {
    return (
      <div className="app">

        <div className="header">
           <h1 className="logo">R/H</h1>
           <nav>
             <li>FEATURES</li>
             <li>PRICING</li>
             <li>CONTACT</li>
             <button type="button" class="btn btn-sm btn-outline-dark">LOG IN</button>
           </nav>
        </div>

        <div className="body">
            <h3 className="introtext">Keep organized. <br/>Stay adventurous.</h3>
            <img className ="mainimage" src={head}/>
        </div>

        <Features/>
    
      </div>
    )
  }
}
