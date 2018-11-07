import React, { Component } from 'react'
import axios from 'axios'
import {connect} from 'react-redux'
import {updateUser, logoutUser} from '../../redux/reducer'
import {Link} from 'react-router-dom'
import Modal from 'react-responsive-modal'
import Input from '@material-ui/core/Input'
import './Sidebar.css'


class Sidebar extends Component {
  constructor(){
    super()
    this.state = {
      open: false,
      listName: ''
    }
  }

  componentDidMount(){
    axios.get('/api/user-info').then((res) => {
      this.props.updateUser(res.data)
    })
  }

  saveList = () => {
    const {listName} = this.state
    axios.post('/api/addlist', {listName}).then(response => {

      console.log('list response: ', response.data)
      this.setState({open: false})
      
    })
  }

  logOut = () => {
    axios.post('/api/logout').then(() => {
      this.props.logoutUser()
      this.props.history.push('/')
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
            <i onClick={() => this.setState({open: true})}
            className="fas fa-plus-circle add-client-list"/>

          </div>

          <div className="listitem">
            <p>2018 Clients</p>
          </div>

          <Modal open={this.state.open} 
          onClose={() => this.setState({open: false})} center>
          <h3 className='modal-title'><i className="fas fa-users"/> Add Client List</h3>
          <div className="list-modal">

          <Input
          className="clientinput"
          placeholder="Client List Name"
          onChange={e => this.setState({listName: e.target.value})}/>

          <button type="button" className="btn btn-primary save full" 
        onClick={this.saveList}
        >+ Add List</button>

          </div>

          </Modal>
          
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
