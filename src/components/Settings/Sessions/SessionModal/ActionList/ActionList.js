import React, { Component } from 'react'
import ActionItem from './ActionItem'
import {connect} from 'react-redux'
import { updateProps } from '../../../../../redux/reducer'
import { Droppable } from 'react-beautiful-dnd'

class ActionList extends Component {
    constructor(){
        super()
        this.state = {
            action: '',
            actionList: []
        }
    }

  componentDidMount =() => {
      //If editing a client or a sessionType, put those actions on state and update props.
      const {sessionModal, clientSettingsModal} = this.props
      if(sessionModal.session){
          const {session} = sessionModal
          if(session.session_name){
              const {actions} = session
              this.setState({actionList: actions}, () => {
                this.props.updateProps({currentActions: actions })
              })
          }
        
      }   

      else if(!clientSettingsModal.newClient){
        const {actionList} = clientSettingsModal.client
        this.setState({ actionList }, () => {
            this.props.updateProps({currentActions: actionList})
        })  
      }

      else {
        const {currentActions} = this.props
        this.setState({actionList: currentActions})
      }

    }

    componentDidUpdate(prevProps){
        if(prevProps.currentActions !== this.props.currentActions){
            const {currentActions} = this.props
            this.setState({actionList: currentActions})
        }
    }

    deleteItem = (i) => {
        //Modal list of action items, delete from array
        const {currentActions} = this.props
        currentActions.splice(i, 1)
        this.setState({actionList: currentActions}, () => {
            this.updateActionItems(currentActions)
        })
    }
    
    addItem = (e) => {
        //Modal list of action items, adding to array
    
        if(e.key==="Enter" || !e.key){
            const {currentActions} = this.props
            var newItem = {name: this.state.action, check: false}
        
            currentActions.push(newItem)
            this.setState({ action: '' })
            e.target.value = ''
    
            this.updateActionItems(currentActions)
        }
    }
    
    updateActionItems = (currentActions) => {
        this.props.updateProps({ currentActions })
    }

    
  render() {
    return (
        <div className="action-container-client center column">
            <div className="add-input-container center">
                
                <input 
                className="input-box"
                placeholder="Add Action"
                value={this.state.action}
                onChange={e => this.setState({action: e.target.value})}
                onKeyDown={e => this.addItem(e)}
                />

                <i className="fas fa-plus-square add-action-button"
                onClick={this.addItem}/>
            </div>
            
        <div className="action-container">
        
            <Droppable droppableId={'action-area'}>
            {provided => (
            <div ref={provided.innerRef}
            {...provided.droppableProps}>
                {this.state.actionList.map( (e,i) => {
                    
                    return (
                    <ActionItem 
                    key={i}
                    item={e} 
                    index={i}
                    deleteItem={this.deleteItem}
                    />
                    )
                }
                )}
                {provided.placeholder}
            </div>
            )}
            </Droppable>

        </div>
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

