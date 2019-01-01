import React, { Component } from 'react'
import ListItem from './ListItem'
import { Droppable } from 'react-beautiful-dnd'

export default class Lists extends Component {
    constructor(){
        super()
        this.state = { 
            lists: []
        } 
    }

  render() {
    const isEditing = this.props.optionsMenuOpen ? 'flex' : 'none'
    
    return (
        <Droppable droppableId={'action-area'} data-test="comp-lists">
            {provided => (
            <div ref={provided.innerRef}
            {...provided.droppableProps}>
                {this.props.lists.map( (e,i) => {
                    
                    if(this.props.listId===e.list_id){
                        return (
                          <div key={e.list_id}>
                          <ListItem
                          item={e}
                          index={i}
                          id={e.list_id}
                          active={true}
                          clickList={this.props.clickList}
                          openClient={this.props.openClient}
                          optionsMenu={this.props.optionsMenu}
                          />
                          <div className="options-menu sidebar-edit" 
                          style={{ display: isEditing }}>
                          <p onClick={() => this.props.updateList(e, i)}
                          ><i className="far fa-edit"/>edit</p>
                          <p onClick={() => this.props.deleteListCheck(e, i)}
                          ><i className="far fa-trash-alt"/>delete</p>
                          </div>
                          </div>
                        )
                      }
                      else {
                        return (
                         <ListItem
                         item={e}
                         index={i}
                         id={e.list_id}
                         key={e.list_id}
                         active={false}
                         clickList={this.props.clickList}
                         />
                        )
                      }
                   }
                )}
                {provided.placeholder}
            </div>
            )}
        </Droppable>
    )
  }
}
