import React, { Component } from 'react'
import './SessionModal.css'
import Modal from 'react-responsive-modal'
import Input from '@material-ui/core/Input'
import axios from 'axios'
import {connect} from 'react-redux'
import { updateProps } from '../../../../redux/reducer'

class SessionModal extends Component {
    constructor(){
        super()
        this.state = {
          name: '',
          action: '',
          price: '',
          color: 'Purple',
          actionList: [
            {"name": "inquired"},
            {"name": "emailed"},
            {"name": "booked!"}
          ]
        }
      }

    componentDidUpdate(prevProps){
        if(prevProps !== this.props){
            const {sessionModal} = this.props
        
            if(sessionModal.session && sessionModal.session.session_name){
                const {session} = this.props.sessionModal
                this.setState({
                    name: session.session_name,
                    price: session.session_price,
                    color: session.session_color,
                    actionList: session.actions
                })
            }
        }
    }

    addItem = (e) => {
            //Modal list of action items, adding to array
            if(e.key==="Enter"){
                var newList = this.state.actionList
                var newItem = {"name": this.state.action}
            
                newList.push(newItem)
            
                this.setState({
                actionList: newList, 
                action: ''
                })
                e.target.value = ''
            }
      }
    
    deleteItem = (i) => {
            //Modal list of action items, delete from array
            var newList = this.state.actionList
            newList.splice(i, 1)
            this.setState({actionList: newList})
      }

    saveSession = () => {
        //Axios call to store session in DB: name, color, price, actionList
        var sessionInfo = {
          name: this.state.name,
          price: this.state.price,
          color: this.state.color,
          actionList: this.state.actionList
        }
    
        //Need to add a condition to check for user input. If user inputs all fields, make axios.post. Otherwise warn user.
        
        if(this.props.sessionModal.new === true){
            //If new client
            axios.post('/api/storesession', {sessionInfo} ).then((response) => {
                var newSessions = this.props.sessionTypes.slice()
                newSessions.push(response.data[0])
                this.props.updateProps({sessionTypes: newSessions})
                //Reset to initial state
                this.setState({ actionList: [ {"name": "inquired"},
                {"name": "emailed"}, {"name": "booked!"}]  })
                //Close modal
                this.onCloseModal()
            })
        
        }
        else {
            //If updating previous client
            //TODO: Form axios/service to handle updating session.
            const {session_id} = this.props.sessionModal.session
            sessionInfo = addId(session_id)
            axios.put('/api/updatesession', {sessionInfo}).then((response) => {
                const {index} = this.props.sessionModal.session
                let updatedSession = response.data[0]
                let tempSessionTypes = this.props.sessionTypes
                tempSessionTypes.splice(index, 1, updatedSession)

                this.props.updateProps({ sessionTypes: tempSessionTypes })

                this.onCloseModal()
            })


            function addId(id){
                return {...sessionInfo, ...{session_id: id}}
            }
            
        }
    
      }


    onCloseModal = () => {
        //Props function to close modal
        this.props.updateProps({sessionModal: {open: false, new: false, session: {} }})
      };


  render() {
    const {sessionModal} = this.props

    return (
        <Modal open={sessionModal.open} onClose={this.onCloseModal} center>
            <h3 className="title">
                {sessionModal.new ? `Add A Session` 
                : `Edit ${sessionModal.session.session_name}`}
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

          <div className="actioninfo">

          <Input 
          placeholder="Add Action"
          fullWidth={true}
          classes={{root: 'inputfield'}}
          onChange={e => this.setState({action: e.target.value})}
          onKeyDown={e => this.addItem(e)}
          />

          {this.state.actionList.map( (e,i) => (
                <div className="actionitem" id={i}>
            {/* Object.keys(e) returns the keys listed at the element.
            Which is an array with one key value. Currying [0] returns the string value vs. the array of the string value. */}
              <i className="far fa-check-circle"/>{e.name}
              <i className="far fa-trash-alt deleteitem"
              onClick={() => this.deleteItem(i)}/>
                </div>
              )
          )}

          </div>

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
