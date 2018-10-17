import React, { Component } from 'react'
import './Home.css'
import head from '../../assets/head.jpg'

export default class Home extends Component {
  render() {
    return (
      <div className="app">

        <div className="header">
           <h1 className="logo">R/H</h1>
        </div>

        <div className="body">
            <h3 className="introtext">Photographers, meet your new workspace.</h3>
            <img className ="mainimage" src={head}/>
        </div>
    
      </div>
    )
  }
}
