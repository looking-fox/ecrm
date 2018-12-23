import React, { Component } from 'react'
import './Sidebar.css'
import Logo from '../../assets/logo.png'
import Tutorial from '../Clients/Tutorial/Tutorial'
import SubscriptionModal from './SubscriptionModal/SubscriptionModal';
import Lists from './Lists'
import axios from 'axios'
import Fade from 'react-reveal/Fade'
import {connect} from 'react-redux'
import {updateUser, logoutUser, updateCurrentList, updateClientModal, updateProps} from '../../redux/reducer'
import Modal from 'react-responsive-modal'
import {DragDropContext} from 'react-beautiful-dnd'

class Sidebar extends Component {
  
  constructor(){
    super()
    this.state = {
      open: false,
      lists: [],
      listName: '',
      deleteListCheck: false,
      listInEdit: {},
      listToMove: null,
      showTutorial: false,
      userMenu: false,
      optionsMenu: false,
      subscriptionModal: false
    }

    //If options menu is open, but user clicks away--close menu.
    window.addEventListener("click", (event) => {
      const {id} = event.target
      if(id !== 'menu-icon' && this.state.optionsMenu){
          this.setState({ optionsMenu: false }) 
      }
      if(id !== 'user-menu' && this.state.userMenu){
          this.setState({ userMenu: false })
      }
    });
  }

  
  componentDidMount(){
    axios.get('/api/user-info').then( res => {
      const {pathname} = this.props.history.location
      const {lists} = res.data
      this.setState({ lists }) 
      this.props.updateUser(res.data)
      
      if(lists[0]){
            if(lists[0].list_id){
              let id = lists[0].list_id
              this.props.updateCurrentList( {listId: id} )
            }
      }
      if(pathname === "/dashboard/welcome"){
        this.setState({showTutorial: true})
      }
     
    }).catch(error => {
      //If 500 error with no user, redirect to home page. 
      this.props.history.push('/')
    })
  }

  onDragEnd = result => {
    const {destination, source, draggableId} = result

    //If dropped outside droppable or same index just return
    if(!destination) return
    if(destination.droppableId === source.droppableId &&
    destination.index === source.index) return 
    
    //Else splice and move to new position & update props
    let movingItem = this.state.lists[draggableId]
    let previousItem = this.state.lists[source.index]

    var newList = this.state.lists.slice()
    newList.splice(source.index, 1)
    newList.splice(destination.index, 0, movingItem)
    
    console.log('dest: ', destination)
    console.log('source: ', source)
    console.log('newList: ', newList)

    let swap = { 
      dragId: movingItem.list_id,
      hoverId: previousItem.list_id,
      dragIndex: source.index, 
      hoverIndex: destination.index
    }

    axios.post('/api/changelistorder', {swap} )

    .then( () => this.setState({lists: swap}))
        
  }

  // moveListItem = (dragIndex, hoverIndex) => {
	// 	const { lists } = this.state
  //   const dragList = lists[dragIndex]
    
	// 	this.setState(
	// 		update(this.state, {
	// 			lists: {
	// 				$splice: [[dragIndex, 1], [hoverIndex, 0, dragList]],
	// 			},
	// 		}),
  //   )

  //   lists[dragIndex]["index_id"] = hoverIndex
  //   lists[hoverIndex]["index_id"] = dragIndex

  //   let dragId = lists[dragIndex]["list_id"]
  //   let hoverId = lists[hoverIndex]["list_id"]

  //   let swap = { dragId, hoverId, dragIndex, hoverIndex}

  //   axios.post('/api/changelistorder', {swap} )
    
  // }
  
  //Hit enter key on input box to save list.
  returnSave = (event) => {
    if(event.keyCode === 13) this.saveList()
  }

  saveList = () => {
    const {listName} = this.state

    if(this.state.listInEdit.list_name){
        const {index, list_id} = this.state.listInEdit
        axios.put('/api/updatelist', {list_id, listName}).then(() => {
          let newList = this.state.lists
          let updatedListItem = this.state.lists[index]
         
          updatedListItem["list_name"] = listName
          newList.splice(index, 1, updatedListItem)
       
          this.setState({open: false, lists: newList, listInEdit: {}, listName: ''})
          this.props.updateProps({lists: newList, listId: -1})
          this.props.updateProps({listId: list_id})
        })
    }
    else {

    axios.post('/api/addlist', {listName}).then(response => {
      let newList = response.data[0]
      let updatedList = this.state.lists
      updatedList.push(newList)
      this.props.updateProps({lists: updatedList})
      this.setState({open: false, lists: updatedList})
    })
  }
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
                  })
  
                }
          }
        } 
        else {
        alert("You'll first want to head over to Tools > Templates and add a few session types.")
             }
        })
  }

  clickList = (list) => {
    this.updateCurrentList(list.list_id)
    
        if(this.props.match.path !== '/dashboard'){
          this.props.history.push('/dashboard')
        }
  }

  optionsMenu = () => {
    this.setState({ optionsMenu: !this.state.optionsMenu })
  }

  deleteListCheck = (list, index) => {
    //Add index to list var that we verify user wants to delete.
    //Set default listId to move clients to that isn't current list.

    let listWithIndex = {...list, ...{ index } }
    let defaultListId = 
    this.state.lists.length > 1 ? 
    this.state.lists.filter(e => {
      return e.list_id !== list.list_id
    })[0].list_id
    :
    this.state.lists[0].list_id

    this.setState({ 
      listInEdit: listWithIndex, 
      deleteListCheck: true,
      listToMove: defaultListId
    })
  }

  updateList = (list, index) => {
    const {list_name} = list
    let listWithIndex = {...list, ...{index} }
    this.setState({open: true, listName: list_name, listInEdit: listWithIndex})
  }

  deleteList = () => {
    const {index, list_id} = this.state.listInEdit
    
      axios.delete(`/api/deletelist/${list_id}`).then(() => {
      let newList = this.state.lists
      newList.splice(index, 1)

      this.props.updateProps({listId: -1, lists: newList})
      this.setState({deleteListCheck: false, lists: newList, listInEdit: {}, listName: '' })
      })
  }

  moveClients = () => {
    let deleteId = this.state.listInEdit.list_id
    let moveId = this.state.listToMove
    axios.put('/api/moveclients', {deleteId, moveId})
    .then( () => this.deleteList() )
  }

  showAllClients = () => {
    this.updateCurrentList(-1)

    if(this.props.match.path !== '/dashboard'){
      this.props.history.push('/dashboard')
    }
  }

  //Todo: Combine these functions (openSub && showUserMenu)
  showUserMenu = () => {
    this.setState(prevState => {
      return {userMenu: !prevState.userMenu}
    })
  }

  toggleSubscription = () => {
    this.setState(prevState => {
      return {subscriptionModal: !prevState.subscriptionModal}
    })
  }

  logOut = () => {
    axios.post('/api/logout').then(() => {
      this.props.logoutUser()
      this.props.history.push('/')
    })
  }

  hideTutorial = () => {
    this.setState({showTutorial: false})
  }

  
  render() {
    const isUserMenuOpen = this.state.userMenu ? 'flex' : 'none'
    
    return (
      <Fade>
        <div className="sidebar">

          <div className="topbar">

              <img 
              className="profileimage"
              id="user-menu"
              src={this.props.picture} 
              alt="user profile"
              onClick={() => this.showUserMenu()}
              />

              <div className="options-menu user-menu" 
              style={{display: isUserMenuOpen}}>
  
                <p onClick={() => this.props.history.push('/tools/templates')}
                ><i className="fas fa-wrench"/>tools</p>

                <p onClick={this.toggleSubscription}>
                <i className="fas fa-credit-card"/>subscription</p>
               
                <p onClick={this.logOut}>
                <i className="fas fa-sign-in-alt"/>logout</p>

              </div>
              
            {/* Normally I'd use Link. But props is not updating location. Currently reviewing MJacksons notes on blocked location props.  */}
            
          </div>
         
          <div className="menu-item center"
          onClick={this.showAllClients}>

            <p><i className="fas fa-users"/>Clients</p>
            <i onClick={() => this.setState({open: true})}
            className="fas fa-plus-circle add-icon menu-icon"/>

          </div>


          <DragDropContext onDragEnd={this.onDragEnd}>

            <Lists
            lists={this.state.lists}
            listId={this.props.listId}
            optionsMenu={this.optionsMenu}
            optionsMenuOpen={this.state.optionsMenu}
            clickList={this.clickList}
            openClient={this.openClient}
            updateList={this.updateList}
            deleteListCheck={this.deleteListCheck}/>

          </DragDropContext>


          <div className="sidebar-footer">
            <img src={Logo} alt="Fox Logo"/>  
            <i className="far fa-question-circle"
            onClick={() => this.setState({showTutorial: !this.state.showTutorial})}/>
            <a href="https://app.termly.io/document/terms-of-use-for-saas/c574334a-93e2-4fc1-a7b4-63c6ae0b00e4">Terms of Service</a>
        
            <a href="https://app.termly.io/document/privacy-policy/1eb8b9ce-5fa7-427e-8df2-157a19f61807">Privacy Policy</a>
          </div>


          {/* Modal to Add List or Edit Previous List */}
          <Modal open={this.state.open} 
          onClose={() => this.setState({open: false, listName: '', listInEdit: {} })} center>
          {this.state.listInEdit.list_name ? 
          <h3 className='modal-title'>Update List</h3>
           :
           <h3 className='modal-title'>
           <i className="fas fa-users"/> Add Client List
           </h3>}

            <input 
            className="input-box" autoFocus
            placeholder="Session Name"
            value={this.state.listName}
            onChange={e => this.setState({listName: e.target.value})}
            onKeyDown={e => this.returnSave(e)}
            />

          <div className="list-modal">

          <button type="button" className="btn btn-primary save full" onClick={this.saveList}>
          {this.state.listInEdit.list_name ? 
          'Save List' : '+ Add List'}
          </button>

          </div>

          </Modal>

         {/* Modal to check if user wants to delete list */}
           <Modal open={this.state.deleteListCheck} 
          on
          onClose={() => this.setState({deleteListCheck: false, listName: '', listInEdit: {} })} center>
            <h3 className='modal-title'> 
            {this.state.lists.length > 1 ? 
            <p>
            Keep clients from {this.state.listInEdit.list_name}?
            </p>
            :
            <p>
            Delete {this.state.listInEdit.list_name}?
            </p>
            }
            
            </h3>
            <div>
            
            {/* select list to transfer */}

            {this.state.lists.length > 1 ? 
            <React.Fragment>
            <p> Move Clients to: </p>
            <select className="session-menu"
            onChange={e => this.setState({listToMove: parseInt(e.target.value)})}> 
                {this.state.lists
                .filter(e => {
                  return e.list_id !== this.state.listInEdit.list_id
                })
                .map( (e,i) => {
                  return (
                    <option value={e.list_id} key={e.list_id}>         
                      {e.list_name} 
                    </option>
                    )
                })}
            </select>
            </React.Fragment>
            :
            ''}

             {/* select list to transfer */}

            {this.state.lists.length > 1 ? 
            <React.Fragment>
              <button type="button" className="btn btn-danger save full" onClick={this.moveClients}>Yes, Move Clients First</button>
              
              <button type="button" className="btn btn-danger save full" onClick={this.deleteList}>No, Delete Everything</button>
            </React.Fragment>
            : 
            <button type="button" className="btn btn-danger save full" onClick={this.deleteList}>Delete List</button>
            }
            

            </div>
          </Modal>

          <Tutorial 
          showTutorial={this.state.showTutorial}
          hideTutorial={this.hideTutorial}/>

          <SubscriptionModal
          {...this.props}
          open={this.state.subscriptionModal}
          hide={this.toggleSubscription}/>
          
        </div>
      </Fade>
    )
  }
}

function mapStateToProps(state){
  return {
    ...this.props, ...state
  }
}

export default connect(mapStateToProps, {updateUser, logoutUser, updateCurrentList, updateClientModal, updateProps})(Sidebar)