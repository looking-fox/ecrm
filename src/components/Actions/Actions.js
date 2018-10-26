import React, { Component } from 'react'
import './Actions.css'

export default class Actions extends Component {

  render(props) {
     
    return (
        <div className="list">
            {this.props.actionList.map((e,i) => {
                return (
                    <div className="action">
                        <i className="far fa-check-circle"/>
                        <p>{Object.keys(JSON.parse(e))}</p>
                    </div>
                )
            })}
        </div>
    )
  }
}
