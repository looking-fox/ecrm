import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import './Home.css'
import head from '../../assets/head.jpg'
import Navbar from '../NavBar/NavBar'
import Features from '../Features/Features'
import Footer from '../Footer/Footer'

var smoothScroll = require('smoothscroll');

export default class Home extends Component {
  
  render() {
    
    return (
      <div className="home">
      <Navbar {...this.props}/>

        <div className="body">
            <h3 className="introtext">Keep organized. <br/>Stay adventurous.</h3>
            <img className ="mainimage" src={head} alt="Yosemite Elopement"/>
        </div>

        <Features/>
        <Footer/>

      </div>
    )
  }
}
