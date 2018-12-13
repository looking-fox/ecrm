import React, { Component } from 'react'
// import { PropTypes } from 'react'
import './NavBar.css'
import { login } from '../../redux/functions'
import Logo from '../../assets/logo.png'
var smoothScroll = require('smoothscroll');


export default class NavBar extends Component {
    
    

    handleClick(location){
        
        if(this.props.match.path === '/contact'){

          //Async IIFE that forces handleScroll to wait until props updates before smooth scrolling.

            (async () => {
              let pathPromise = new Promise((resolve, reject) => {
                this.props.history.push('/')
                resolve(this.props.history.location.pathname)
              })

              let newPath = await pathPromise
              if(newPath === '/') this.handleScroll(location)

            })()
           
        }

        else this.handleScroll(location)
   
      }

    handleScroll(location){
        var destination = document.querySelector(`.${location}`);
        smoothScroll(destination)
      }

    goToContact = () => {
          this.props.history.push('/contact')
      }
    
    


  render() {
    
    return (
        <div className="header">

          <div className="logo-container center">
              <img src={Logo} alt="Logo" className="logo-image"/>
              <h1 className="logo center"
              onClick={() => this.props.history.push('/')}>
              LOOKING FOX</h1>
          </div>

            <nav>
              <li onClick={() => this.handleClick('features')}>FEATURES</li>
              <li onClick={() => this.handleClick('about')}>ABOUT</li>
              <li onClick={this.goToContact}>CONTACT</li>
              <button type="button" className="btn btn-sm btn-outline-dark log-in-button" onClick={login}>LOG IN</button>
            </nav>
     </div>
    )
  }
}
