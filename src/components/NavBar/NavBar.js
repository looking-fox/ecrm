import React, { Component } from 'react'
// import { PropTypes } from 'react'
import './NavBar.css'
var smoothScroll = require('smoothscroll');

export default class NavBar extends Component {
    
    login = () => {
    
        let {REACT_APP_AUTH0_DOMAIN,
          REACT_APP_AUTH0_CLIENT_ID
        } = process.env;
      
        let url = `${encodeURIComponent(window.location.origin)}/auth/callback`
    
        window.location = `https://${REACT_APP_AUTH0_DOMAIN}/authorize?client_id=${REACT_APP_AUTH0_CLIENT_ID}&scope=openid%20profile%20email&redirect_url=${url}&response_type=code`
      
      }

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
            <h1 className="logo"
            onClick={() => this.props.history.push('/')}>LOOKING FOX</h1>
            <nav>
            <li onClick={() => this.handleClick('features')}>FEATURES</li>
            <li onClick={() => this.handleClick('pricing')}>PRICING</li>
            <li onClick={this.goToContact}>CONTACT</li>
            <button type="button" className="btn btn-sm btn-outline-dark log-in-button" onClick={() => this.login()}>LOG IN</button>
            </nav>
     </div>
    )
  }
}
