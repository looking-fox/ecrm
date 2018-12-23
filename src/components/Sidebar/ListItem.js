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
				<div className="listitem current-list" 
				{...provided.draggableProps}
				{...provided.dragHandleProps}
				ref={provided.innerRef}
				key={this.props.item.list_id} onClick={() => this.props.clickList(this.props.item)}>
					<p>

					<i id="menu-icon" className="fas fa-ellipsis-v menu-icon options-icon"
					onClick={this.props.optionsMenu}/>

						{this.props.item.list_name}
						
						<i onClick={() => this.props.openClient(this.props.item)}
				className="fas fa-plus-circle menu-icon add-icon"/>

					</p>
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
				<div className="listitem" key={this.props.item.list_id}
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


ListItem.defaultProps = {
	item: {list_id: 5}
};

// ListItem.propTypes = {
// 	item: PropTypes.object.isRequired,
// 	index: PropTypes.number.isRequired,
// 	id: PropTypes.number.isRequired,
// 	active: PropTypes.bool.isRequired,
// 	clickList: PropTypes.func.isRequired,
// 	openClient: PropTypes.func,
// 	moveListItem: PropTypes.func.isRequired,
// 	optionsMenu: PropTypes.func
// }

