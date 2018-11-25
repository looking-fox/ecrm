import React, { Component } from 'react'
import ActionList from '../../Settings/Sessions/SessionModal/ActionList/ActionList'
import {DragDropContext} from 'react-beautiful-dnd'
import {connect} from 'react-redux'
import {updateProps} from '../../../redux/reducer'

class ClientActions extends Component {

  componentDidMount(){
    const {actionList} = this.props.clientSettingsModal.client
    this.props.updateProps({ currentActions: actionList })
  }

  onDragEnd = result => {
    const {destination, source, draggableId} = result

    //If dropped outside droppable or same index just return
    if(!destination) return
    if(destination.droppableId === source.droppableId &&
    destination.index === source.index) return 
    
    //Else splice and move to new position & update props
    let movingItem = this.props.currentActions[draggableId]
    var newList = this.props.currentActions
    newList.splice(source.index, 1)
    newList.splice(destination.index, 0, movingItem)
    
    this.props.updateProps({currentActions: newList})
    
}

  render() {
    return (
      <div className="actions-container">
        <DragDropContext onDragEnd={this.onDragEnd}>
                  <ActionList/> 
          </DragDropContext>
      </div>
    )
  }
}

function mapStateToProps(state){
  return {
      ...this.props, ...state
  }
}
export default connect(mapStateToProps, {updateProps} )(ClientActions)
