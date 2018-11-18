import React, { Component } from 'react'
import axios from 'axios'
import {connect} from 'react-redux'
import {updateUser, logoutUser, updateCurrentList, updateClientModal} from '../../redux/reducer'
import Modal from 'react-responsive-modal'
import Input from '@material-ui/core/Input'
import ListItem from './ListItem'
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

  openClient = () => {
    axios.get('/api/getsessiontypes').then(response => {
      //If user has no session types, they can't add a client. 
      //If user has no lists, they can't add clients. 
        if(response.data[0]){
            if(response.data[0].session_id !== null){
                if(this.props.lists[0]){
  
                  this.setState({
                    sessionTypes: response.data,
                    sessionPrice: response.data[0].session_price
                  })

                  this.props.updateClientModal({
                    clientModalOpen: true
                    // sessionTypes: response.data,
                    // sessionPrice: response.data[0].session_price
                  })
  
                }
            
          }
        }
        //TODO: Different alert statements for no client list or no sessions. 
        else {
        alert("You'll first want to head over to Settings > Sessions and add a few session types.")
             }
        })
  }

  clickList = (list) => {
    this.updateCurrentList(list.list_id)
    
        if(this.props.match.path !== '/dashboard'){
          this.props.history.push('/dashboard')
        }
  }

  showAllClients = () => {
    this.updateCurrentList(-1)

    if(this.props.match.path !== '/dashboard'){
      this.props.history.push('/dashboard')
    }
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

        {/* Normally I'd use Link. But props is not updating location. Currently reviewing MJacksons notes on blocked location props.  */}
        
         <i onClick={() => this.props.history.push('/settings')}
         className="fas fa-cog"/>
          </div>

          <div className="menuitem"
          onClick={this.showAllClients}>

            <p><i className="fas fa-users"/>Clients</p>
            <i onClick={() => this.setState({open: true})}
            className="fas fa-plus-circle add-client-list"/>

          </div>

          {this.state.lists.map(e => {
        //If propsId is itemId, this list is currently selected.
            
            if(this.props.listId===e.list_id){
              return (
                <ListItem
                item={e}
                active={true}
                clickList={this.clickList}
                openClient={this.openClient}
                />
              )
            }
            else {
              return (
               <ListItem
               item={e}
               active={false}
               clickList={this.clickList}
               />
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
export default connect(mapStateToProps, {updateUser, logoutUser, updateCurrentList, updateClientModal})(Sidebar)
