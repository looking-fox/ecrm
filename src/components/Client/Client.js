import React, { Component } from 'react'
import './Client.css'

export default class Client extends Component {
     constructor(){
       super()
       this.state = {
         optionsMenu: false
       }
       window.addEventListener("click", (event) => {
        if(event.target.id !== `client-edit-icon-${this.props.clientId}` && this.state.optionsMenu){
            this.setState({optionsMenu: false}) 
        }
      });

     }

     openOptionsMenu = () => {
      this.setState({optionsMenu: !this.state.optionsMenu})
      this.props.openClientSettingsModal(this.props)
     }

  render(){
  const openMenu = this.state.optionsMenu ? 'flex' : 'none'

  return (
    <div className="clientcontainer">

        <div className="client">

            <div className="name item">
            <p>{this.props.name}</p>
            </div>

            <div className="package item">
            <span className={`bubble ${this.props.sessionColor}`}>{this.props.sessionName}</span>
            </div>

            <div className="date item">
            <p>{this.props.sessionDate}</p>
            </div>

            <div className="location item"
            onClick={() => this.props.goToMap(this.props.sessionLocation)}>
            <p><i className="far fa-map"/>{this.props.sessionLocation}</p>
            </div>

            <div className="total item">
            <p>{this.props.sessionPrice}</p>
            </div>

            <div className="settings">
            <i className="fas fa-ellipsis-h"
            id={`client-edit-icon-${this.props.clientId}`}
            onClick={this.openOptionsMenu}/>

                  <div className="options-menu client-edit" 
                    style={{display: openMenu}}>

                      <p onClick={() => this.props.openClientModal()}>
                        <i className="far fa-edit"/>edit</p>

                      <p onClick={() => this.props.optDeleteModal()}
                      ><i className="far fa-trash-alt"/>delete</p>

                  </div>
            </div>

        </div>

    </div>
  )
}
}
