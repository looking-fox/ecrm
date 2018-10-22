import React, { Component } from 'react'
import axios from 'axios'
import {connect} from 'react-redux'
import {updateUser, logoutUser} from '../../redux/reducer'
import {Link} from 'react-router-dom'

import './Sidebar.css'


class Sidebar extends Component {

  componentDidMount(){
    axios.get('/api/user-info').then((res) => {
      this.props.updateUser(res.data)
    })
  }

  logOut = () => {
    axios.post('/api/logout').then(() => {
      this.props.logoutUser()
    })
  }

  render() {
    return (
        <div className="sidebar">

          <div className="topbar">
          <img 
          className="profileimage"
          src={this.props.picture} 
          alt="profile"/>
          <i 
          onClick={() => this.logOut()}
          className="fas fa-sign-out-alt"/>

          <Link to="/settings"><i className="fas fa-cog"/></Link>
          </div>

          <div className="menuitem">
            <Link to="/dashboard"><p><i className="fas fa-users"/>Clients</p></Link>
          </div>

          <div className="listitem">
            <p>2018 Clients</p>
          </div>
          
        </div>
    )
  }
}

function mapStateToProps(state){
  return {
    ...this.props, ...state
  }
}
export default connect(mapStateToProps, {updateUser, logoutUser})(Sidebar)
