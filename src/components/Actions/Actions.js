import React, { Component } from 'react'
import './Actions.css'

export default class Actions extends Component {
  render() {
    return (
        <div className="list">
        
        <div className="action">
            <i className="fas fa-check-circle done"/>
            <p>pricing sent</p>
        </div>
    
        <div className="action">
            <i className="fas fa-check-circle done"/>
            <p>wants to book</p>
        </div>

        <div className="action">
            <i className="fas fa-check-circle done"/>
            <p>booked!</p>
        </div>
    
        <div className="action">
            <i className="far fa-check-circle"/>
            <p>date set</p>
        </div>
    
        <div className="action">
            <i className="far fa-check-circle"/>
            <p>elopement</p>
        </div>
    
        <div className="action">
            <i className="far fa-check-circle"/>
            <p>files delivered</p>
        </div>

        <div className="action">
            <i className="far fa-check-circle"/>
            <p>feedback sent</p>
        </div>
    
        </div>
    )
  }
}
