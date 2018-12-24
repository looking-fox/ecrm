import React, { Component } from 'react'
import PropTypes from 'prop-types';
import './Client.css'

//TODO: 

//Payments Input to Native Input
//Payments Input to include cents. 

//Edit-click to-do item on ActionList. 
//On Client, payment + icon turn green on full payment. 

//Month search for Date Picker to be gray (not baby blue)
//Search Input Bar for Filter Bar

export default class Client extends Component {
     constructor(){
       super()
       this.state = {
         optionsMenu: false
       }
       
       window.addEventListener("click", event => {
        if(event.target.id !== `client-edit-icon-${this.props.client.client_id}` && this.state.optionsMenu){
            this.setState({optionsMenu: false}) 
        }
      });

     }

     openOptionsMenu = () => {
      this.setState({optionsMenu: !this.state.optionsMenu})
      this.props.openClientSettingsModal(this.props)
      
     }

  render(){
    const {name, client_id, session_name, session_color, session_price, date, location, session_id} = this.props.client
    var openMenu = this.state.optionsMenu ? 'flex' : 'none'
    var formatDate = new Date(date).toLocaleDateString('en-US')

  return (
    <div className="client-container center column">

        <div className="client">

            <div className="name item">
            <p>{name}</p>
            </div>

            <div className="package item">
            <span className={`bubble ${session_color}`}>{session_name}</span>
            </div>

            <div className="date item">
            <p>{formatDate}</p>
            </div>

            <div className="location item"
            onClick={() => this.props.goToMap(location)}>
            <p><i className="far fa-map"/>{location}</p>
            </div>

            <div className="total item"
            onClick={() => this.props.openPayments({name,client_id, session_price, session_color})}>
            <p><i className="far fa-credit-card"/>{session_price}</p>
            </div>

            <div className="settings">
            <i className="fas fa-ellipsis-h"
            id={`client-edit-icon-${client_id}`}
            onClick={this.openOptionsMenu}/>
 
                  <div className="options-menu client-edit" 
                    style={{display: openMenu}}>

                      <p onClick={() => this.props.openClientModal()}>
                        <i className="far fa-edit"/>edit</p>

                      <p onClick={() => this.props.optDeleteModal(client_id, session_id)}
                      ><i className="far fa-trash-alt"/>delete</p>

                  </div>
            </div>

        </div>

    </div>
  )
}
}

Client.propTypes = {
  index: PropTypes.number.isRequired,
  client: PropTypes.object.isRequired,
  actionList: PropTypes.array.isRequired,
  goToMap: PropTypes.func.isRequired,
  openPayments: PropTypes.func.isRequired,
  openClientModal: PropTypes.func.isRequired,
  optDeleteModal: PropTypes.func.isRequired,
  openClientSettingsModal: PropTypes.func.isRequired
}