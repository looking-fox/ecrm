import React, { Component } from 'react'
import {Draggable} from 'react-beautiful-dnd'

export default class ActionItem extends Component {
  render() {
    return (
        <Draggable 
        draggableId={String(this.props.index)}
        index={this.props.index}>
        {provided => (
            <div className="actionitem" id={this.props.index}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}>
        
        <i className="far fa-check-circle"/>{this.props.item.name}
        <i className="far fa-trash-alt deleteitem"
        onClick={() => this.props.deleteItem(this.props.index)}/>
        
            </div>
        )}
            
        </Draggable>
    )
  }
}
