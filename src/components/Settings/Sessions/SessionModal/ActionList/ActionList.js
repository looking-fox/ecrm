import React, { Component } from 'react'
import ActionItem from './ActionItem'
import Input from '@material-ui/core/Input'
import {connect} from 'react-redux'
import { updateProps } from '../../../../../redux/reducer'
import { Droppable } from 'react-beautiful-dnd'

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

  componentDidMount =() => {
      if(this.props.sessionModal.session){
          const {session} = this.props.sessionModal
          if(session.session_name){
              const {actions} = session
              var newNames = getNames(actions)
              
              this.setState({ actionList: newNames })
              this.props.updateProps({actionList: newNames })
          }
          else {
              this.setState({
                  actionList: this.props.actionList
              })
          }
      }   

        function getNames(actions){
            return actions.map(e => {
                return {name: e.name}
            } )
        }
    }

  componentDidUpdate(prevProps){
      if(prevProps !== this.props){
          const {actionList} = this.props
          this.setState({actionList})
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
    this.props.updateProps({actionList: newList})
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
        <div className="action-container">
                <Input 
                placeholder="Add Action"
                fullWidth={true}
                classes={{root: 'inputfield'}}
                onChange={e => this.setState({action: e.target.value})}
                onKeyDown={e => this.addItem(e)}
                />

            <Droppable droppableId={'action-area'}>
            {provided => (
            <div ref={provided.innerRef}
            {...provided.droppableProps}>
                {this.props.actionList.map( (e,i) => (
                    <ActionItem 
                    key={i}
                    item={e} 
                    index={i}
                    deleteItem={this.deleteItem}
                    />
                  )
                )}
                {provided.placeholder}
            </div>
            )}
            </Droppable>

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
