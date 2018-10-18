import React, { Component } from 'react'
import axios from 'axios'
import {connect} from 'react-redux'
import {updateUser} from '../../redux/reducer'

import './Dashboard.css'
// import { connect } from 'tls';

class Dashboard extends Component {

  componentDidMount(){
    axios.get('/api/user-info').then((res) => {
      this.props.updateUser(res.data)
    })
  }

  render() {
    return (
      <div className="dashboard">
        <div className="sidebar">
        
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
export default connect(mapStateToProps, {updateUser})(Dashboard)
