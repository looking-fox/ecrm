import React, { Component } from 'react'


export default class ListItem extends Component {
  render() {
      const {item} = this.props
      
      if(this.props.active){
        return (
            <div className="listitem current-list" key={item.list_id}
                onClick={() => this.props.clickList(item)}>
                  <p>
                    {item.list_name}
                    <i onClick={() => this.props.openClient(item)}
            className="fas fa-plus-circle add-client-in-list"/>
                  </p>
            </div>
          )
      }
     else {
         return (
            <div className="listitem" key={item.list_id}
                onClick={() => this.props.clickList(item)}>
                  <p>{item.list_name}</p>
            </div>
         )
     }
    
  }
}
