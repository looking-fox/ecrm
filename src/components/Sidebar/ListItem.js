import React, { Component } from 'react'
import { findDOMNode } from 'react-dom'
import { DragSource, DropTarget } from 'react-dnd'
import flow from 'lodash/flow'

const itemSource = {
	beginDrag(props) {
		return {
			id: props.id,
			index: props.index,
		}
	},
}

const itemTarget = {
	hover(props, monitor, component) {
		if (!component) {
			return null
		}
		const dragIndex = monitor.getItem().index
		const hoverIndex = props.index

		// Don't replace items with themselves
		if (dragIndex === hoverIndex) {
			return
		}

		// Determine rectangle on screen
		const hoverBoundingRect = (findDOMNode(
			component,
		)).getBoundingClientRect()

		// Get vertical middle
		const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

		// Determine mouse position
		const clientOffset = monitor.getClientOffset()

		// Get pixels to the top
		const hoverClientY = (clientOffset).y - hoverBoundingRect.top

		// Only perform the move when the mouse has crossed half of the items height
		// When dragging downwards, only move when the cursor is below 50%
		// When dragging upwards, only move when the cursor is above 50%

		// Dragging downwards
		if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
			return
		}

		// Dragging upwards
		if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
			return
		}

		// Time to actually perform the action
		props.moveListItem(dragIndex, hoverIndex)

		// Note: we're mutating the monitor item here!
		// Generally it's better to avoid mutations,
		// but it's good here for the sake of performance
		// to avoid expensive index searches.
		monitor.getItem().index = hoverIndex

	},
}

class ListItem extends Component {
  render() {
    const {item, text, isDragging, connectDragSource, 
    connectDropTarget} = this.props

    const opacity = isDragging ? 0 : 1

    if(this.props.active){
    return (
		connectDragSource &&
		connectDropTarget &&
		connectDragSource(
			connectDropTarget(
            <div className="listitem current-list" 
            key={item.list_id} style={{ opacity }}
                onClick={() => this.props.clickList(item)}>
                  <p>
                    {item.list_name}
                    <i onClick={() => this.props.openClient(item)}
            className="fas fa-plus-circle add-client-in-list"/>
                  </p>
            </div>
			),
          )
        )
    }

    else {
        return (
            connectDragSource &&
            connectDropTarget &&
            connectDragSource(
                connectDropTarget(
                <div className="listitem" key={item.list_id}
                onClick={() => this.props.clickList(item)}>
                      <p>{item.list_name}</p>
                </div>
                ),
              )
            )
    }
         
  }
}

export default flow(
    DragSource(
        'listitem',
        itemSource,
        (connect, monitor) => ({
            connectDragSource: connect.dragSource(),
            isDragging: monitor.isDragging()
        })
    ),
    DropTarget('listitem', itemTarget, (connect) => ({
        connectDropTarget: connect.dropTarget()
    }))
)(ListItem)
