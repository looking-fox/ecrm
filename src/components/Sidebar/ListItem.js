import React, { Component } from 'react'
import { Draggable } from 'react-beautiful-dnd'
import PropTypes from 'prop-types'


export default function ListItem(props) {
	if (props.active) {
		return (
			<Draggable
				draggableId={String(props.index)}
				index={props.index}>
				{provided => (
					<div className="list-item current-list"
						id={props.index}
						{...provided.draggableProps}
						{...provided.dragHandleProps}
						ref={provided.innerRef}
						key={props.item.list_id} onClick={() => props.clickList(props.item)}>


						<i id="menu-icon" className="fas fa-ellipsis-v menu-icon options-icon"
							onClick={props.optionsMenu} />

						<p>{props.item.list_name}</p>

						<i onClick={() => props.openClient(props.item)}
							className="fas fa-plus-circle menu-icon add-icon" />


					</div>
				)}
			</Draggable>
		)
	}

	else {
		return (
			<Draggable
				draggableId={String(props.index)}
				index={props.index}>
				{provided => (
					<div className="list-item"
						key={props.item.list_id}
						id={props.index}
						{...provided.draggableProps}
						{...provided.dragHandleProps}
						ref={provided.innerRef}
						onClick={() => props.clickList(props.item)}>
						<p>{props.item.list_name}</p>
					</div>
				)}
			</Draggable>
		)
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