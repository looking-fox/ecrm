import React, { Component } from 'react'
import Input from '@material-ui/core/Input'
import {connect} from 'react-redux'
import { updateProps } from '../../../../../redux/reducer'


class ActionList extends Component {
    constructor(){
        super()
        this.state = {
            actionList: [
                {"name": "inquired"},
                {"name": "emailed"},
                {"name": "booked!"}
              ],
            action: ''
        }
    }

  componentDidMount(){
      if(this.props.sessionModal.session){
          const {session} = this.props.sessionModal
          if(session.session_name){
              this.setState({
                  actionList: session.actions
              })
          }
      }
  }

  addItem = (e) => {
    //Modal list of action items, adding to array
    if(e.key==="Enter"){
        var updated = this.state.actionList
        var newItem = {"name": this.state.action}
    
        updated.push(newItem)
        this.setState({ actionList: updated, action: '' })
        e.target.value = ''

        this.updateActionItems(updated)
    }
}

updateActionItems = (newList) => {
    const {open, newSession, session} = this.props.sessionModal
    session["actions"] = newList
    this.props.updateProps({sessionModal: {session, open, newSession}})
}

deleteItem = (i) => {
    //Modal list of action items, delete from array
    var updated = this.state.actionList
    updated.splice(i, 1)
    this.setState({actionList: updated})
    this.updateActionItems(updated)
}

  render() {
    return (
        <div>
                <Input 
                placeholder="Add Action"
                fullWidth={true}
                classes={{root: 'inputfield'}}
                onChange={e => this.setState({action: e.target.value})}
                onKeyDown={e => this.addItem(e)}
                />

            {this.state.actionList.map( (e,i) => (
                <div className="actionitem" id={i}>

              <i className="far fa-check-circle"/>{e.name}
              <i className="far fa-trash-alt deleteitem"
              onClick={() => this.deleteItem(i)}/>
              
                </div>
              )
          )}
        </div>
    )
  }
}

function mapStateToProps(state){
    return {
        ...this.props, ...state
    }
}
export default connect(mapStateToProps, {updateProps} )(ActionList)
