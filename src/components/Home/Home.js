import React, { Component } from 'react'
import './Home.css'
import head from '../../assets/head.jpg'
import Workspace from '../../assets/Workspace2.png'
import Navbar from '../NavBar/NavBar'
import Features from '../Features/Features'
import Footer from '../Footer/Footer'

export default class Home extends Component {
  
  render() {
    
    return (
      <div className="home">
      <Navbar {...this.props}/>

        <div className="body">
            <h3 className="introtext">Keep organized. <br/>Stay adventurous.</h3>
            <img className ="mainimage" src={Workspace} alt="Yosemite Elopement"/>
        </div>

        <Features {...this.props}/>
        <Footer/>

      </div>
    )
  }
}
