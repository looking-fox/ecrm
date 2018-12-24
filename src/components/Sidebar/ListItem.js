import React, { Component } from 'react'
import {Draggable} from 'react-beautiful-dnd'
import PropTypes from 'prop-types'


export default class ListItem extends Component {
	
  render() {
    if(this.props.active){
    return (
			<Draggable 
			draggableId={String(this.props.index)}
			index={this.props.index}>
			{provided => (
				<div className="list-item current-list" 
				id={this.props.index}
				{...provided.draggableProps}
				{...provided.dragHandleProps}
				ref={provided.innerRef}
				key={this.props.item.list_id} onClick={() => this.props.clickList(this.props.item)}>
					

					<i id="menu-icon" className="fas fa-ellipsis-v menu-icon options-icon"
					onClick={this.props.optionsMenu}/>

						<p>{this.props.item.list_name}</p>
						
						<i onClick={() => this.props.openClient(this.props.item)}
				className="fas fa-plus-circle menu-icon add-icon"/>

					
				</div>
			)}
			</Draggable>
		) 
    }

    else {
        return (
			<Draggable 
			draggableId={String(this.props.index)}
			index={this.props.index}>
			{provided => (
				<div className="list-item" 
				key={this.props.item.list_id}
				id={this.props.index}
				{...provided.draggableProps}
				{...provided.dragHandleProps}
				ref={provided.innerRef}
                onClick={() => this.props.clickList(this.props.item)}>
                      <p>{this.props.item.list_name}</p>
                </div>
			)}
			</Draggable>
              )    
        }      
    }
}


ListItem.propTypes = {
	item: PropTypes.object.isRequired,
	index: PropTypes.number.isRequired,
	id: PropTypes.number.isRequired,
	active: PropTypes.bool.isRequired,
	clickList: PropTypes.func.isRequired,
	openClient: PropTypes.func,
	optionsMenu: PropTypes.func
}

