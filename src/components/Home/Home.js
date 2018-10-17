import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import axios from 'axios'
import './Home.css'
import head from '../../assets/head.jpg'
import Features from '../Features/Features'
import Footer from '../Footer/Footer'


export default class Home extends Component {
  constructor(){
    super()
    
  }

  login = () => {

    let {REACT_APP_AUTH0_DOMAIN,
      REACT_APP_AUTH0_CLIENT_ID
    } = process.env;
  
    let url = `${encodeURIComponent(window.location.origin)}/auth/callback`
  
    window.location = `https://${REACT_APP_AUTH0_DOMAIN}/authorize?client_id=${REACT_APP_AUTH0_CLIENT_ID}&scope=openid%20profile%20email&redirect_url=${url}&response_type=code`
  
  }


  render() {
    return (
      <div className="app">

        <div className="header">
           <h1 className="logo">R/H</h1>
           <nav>
             <li>FEATURES</li>
             <li>PRICING</li>
             <Link to="/contact"><li>CONTACT</li></Link>
             <button type="button" className="btn btn-sm btn-outline-dark" onClick={() => this.login()}>LOG IN</button>
           </nav>
        </div>

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
