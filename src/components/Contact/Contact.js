import React, { Component } from 'react'
import './Contact.css'
import {Link} from 'react-router-dom'
export default class Contact extends Component {
  render() {
    return (
      <div className="contact">
      
      {/* Warning: Will need to make the navbar a component to avoid duplicating code. */}

        <div className="header">
           <h1 className="logo">R/H</h1>
           <nav>
             <li>FEATURES</li>
             <li>PRICING</li>
             <Link to="/contact"><li>CONTACT</li></Link>
             <button type="button" className="btn btn-sm btn-outline-dark" onClick={() => this.login()}>LOG IN</button>
           </nav>
        </div>


      </div>
    )
  }
}
