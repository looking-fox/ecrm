import React, { Component } from 'react'
import axios from 'axios'
import {connect} from 'react-redux'
import {updateUser, logoutUser, updateCurrentList} from '../../redux/reducer'
import {Link} from 'react-router-dom'
import Modal from 'react-responsive-modal'
import Input from '@material-ui/core/Input'
import './Sidebar.css'


class Sidebar extends Component {
  constructor(){
    super()
    this.state = {
      open: false,
      lists: [],
      listName: ''
    }
  }

  componentDidMount(){
    axios.get('/api/user-info').then((res) => {
      const {lists} = res.data
      this.setState({ lists })

      this.props.updateUser(res.data)

      if(lists[0]){
            if(lists[0].list_id){
              let id = lists[0].list_id
              this.props.updateCurrentList( {listId: id} )
            }
      }
     
    })
  }

  saveList = () => {
    const {listName} = this.state
    axios.post('/api/addlist', {listName}).then(response => {
      let newList = response.data[0]
      let updatedList = this.state.lists
      updatedList.push(newList)
      this.setState({open: false, lists: updatedList})
      //TODO: Update lists in props
    })
  }

  updateCurrentList = (id) => {
      this.props.updateCurrentList( {listId: id} )
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

          {this.state.lists.map(e => {
        //If propsId is itemId, this list is currently selected.
            
            if(this.props.listId===e.list_id){
              return (
                <div className="listitem current-list" key={e.list_id}
                onClick={() => this.updateCurrentList(e.list_id)}>
                  <p>
                    {e.list_name}
                    <i onClick={() => this.setState({open: true})}
            className="fas fa-plus-circle add-client-in-list"/>
                  </p>
                </div>
              )
            }

            else {
              return (
                <div className="listitem" key={e.list_id}
                onClick={() => this.updateCurrentList(e.list_id)}>
                  <p>{e.list_name}</p>
                </div>
              )
            }

          })}

          <Modal open={this.state.open} 
          onClose={() => this.setState({open: false, listName: ''})} center>
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
export default connect(mapStateToProps, {updateUser, logoutUser, updateCurrentList})(Sidebar)
