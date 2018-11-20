import React, { Component } from 'react'
import './SessionModal.css'
import ActionList from './ActionList/ActionList'
import Modal from 'react-responsive-modal'
import Input from '@material-ui/core/Input'
import axios from 'axios'
import {connect} from 'react-redux'
import { updateProps } from '../../../../redux/reducer'
import {DragDropContext} from 'react-beautiful-dnd'

class SessionModal extends Component {
    constructor(){
        super()
        this.state = {
          name: '',
          price: '',
          color: 'Purple'
        }
      }

    componentDidUpdate(prevProps){
        if(prevProps.sessionModal.open !== this.props.sessionModal.open){
            const {sessionModal} = this.props
        
            if(sessionModal.session){
                if(sessionModal.session.session_name){
                const {session_name, session_price, session_color, actions} = this.props.sessionModal.session
                this.setState({
                    name: session_name,
                    price: session_price,
                    color: session_color
                })
            }
          }
        }
    }

    onDragEnd = result => {
        const {destination, source, draggableId} = result

        //If dropped outside droppable or same index just return
        if(!destination) return
        if(destination.droppableId === source.droppableId &&
        destination.index === source.index) return 
        
        //Else splice and move to new position & update props
        let movingItem = this.props.actionList[draggableId]
        var newList = this.props.actionList
        newList.splice(source.index, 1)
        newList.splice(destination.index, 0, movingItem)
        
        this.props.updateProps({actionList: newList})
        
    }
    
    saveSession = () => {
        //Axios call to store session in DB: name, color, price, actionList

        const {actionList} = this.props
        var sessionInfo = {
          name: this.state.name,
          price: this.state.price,
          color: this.state.color,
          actionList
        }
    
        //TODO: add a condition to check for user input. If user inputs all fields, make axios.post. Otherwise warn user.
        
        if(this.props.sessionModal.newSession === true){
            //If new client
            axios.post('/api/storesession', {sessionInfo} ).then((response) => {
                var newSessions = this.props.sessionTypes.slice()
                newSessions.push(response.data[0])
                this.props.updateProps({sessionTypes: newSessions})
    
                //Close modal
                this.onCloseModal()
            })
        
        }
        else {
            //If updating previous client
                
            const newSessions = this.getNewActions()
            this.props.updateProps({sessionTypes: newSessions})

            const {session_id} = this.props.sessionModal.session
            sessionInfo = addId(session_id)

            axios.put('/api/updatesession', {sessionInfo})
            .then(() => this.onCloseModal() )

            function addId(id){
                return {...sessionInfo, ...{session_id: id}}
            }
            
        }
    
      }

    onCloseModal = () => {
        //Props function to close modal and clear form on state
        this.setState({
            name: 'Session Name',
            price: '',
            color: 'Purple'
        })
        this.props.updateProps({sessionModal: 
            {open: false, newSession: false}, 
            actionList: [ {"name": "inquired"}, {"name": "emailed"},
            {"name": "booked!"} ] })
      };

      getNewActions = () => {
        //Returns new sessionType with updated actions
        const {index} = this.props.sessionModal.session
        let tempSessions = this.props.sessionTypes.slice()
        const list = this.props.actionList
        tempSessions[index]["actions"] = list
        return tempSessions
        }


  render() {
    const {sessionModal} = this.props

    return (
        <Modal open={sessionModal.open} onClose={this.onCloseModal} center>
            <h3 className="title">
                {sessionModal.new ? `Add A Session` 
                : 
                <div className="bubble-container">
                <div className={`bubble-display bubble ${this.state.color}`}>
                {this.state.name}
                </div>
                </div>}
            </h3>
            <div className="sessionform">
          

          <div className="sessioninfo">
          <Input 
          autoFocus={true}
          className="clientinput"
          placeholder="Session Name"
          value={this.state.name}
          fullWidth={true}
          classes={{ root: 'input' }}
          onChange={e => this.setState({name: e.target.value})}/>
 
          <select className="colormenu" 
          value={this.state.color}
          onChange={e => this.setState({color: e.target.value})}>
              <option value="Purple">Purple</option>
              <option value="Blue">Blue</option>
              <option value="Red">Red</option>
              <option value="Green">Green</option>
              <option value="Orange">Orange</option>
              <option value="Gray">Gray</option>
          </select>  

          <Input 
          placeholder="Price ($1,000)"
          value={this.state.price}
          fullWidth={true}
          onChange={e => this.setState({price: e.target.value})}/>

          </div>

        <DragDropContext onDragEnd={this.onDragEnd}>
                <ActionList/> 
        </DragDropContext>

        </div>

        <footer>
        <button type="button" className="btn btn-primary save" 
        onClick={this.saveSession}
        >Save</button>
        </footer>
        
        </Modal>
    )
  }
}
function mapStateToProps(state){
    return {
        ...this.props, ...state
    }
}
export default connect(mapStateToProps, {updateProps} )(SessionModal)
