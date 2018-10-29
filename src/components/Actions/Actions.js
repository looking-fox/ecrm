import React, { Component } from 'react'
import './Actions.css'

export default class Actions extends Component {

   changeAction = (index) => {
        console.log(index)
   }

  render(props) {
     
    return (
        //MISSING: Click action item changes UI, updates in DB.

        <div className="list">
            {this.props.actionList.map((e,i) => {
                let key = Object.keys(JSON.parse(e))[0].toString()
               
                if(e[key]){
        //NOTE: Index value will not change since the order is important. So index will work as a key in this instance. Trade Off: React says this is a last resort. But it's not necessary and requires more data for no improvement in this instance. 
                    return (
                        <div className="action" key={i}
                        onClick={() => this.changeAction(i)}>
                            <i className="fas fa-check-circle"/>
                            <p>{Object.keys(JSON.parse(e))}</p>
                        </div>
                    )
                }
                else {
                    return (
                        <div className="action" key={i}
                        onClick={() => this.changeAction(i)}>
                            <i className="far fa-check-circle"/>
                            <p>{Object.keys(JSON.parse(e))}</p>
                        </div>
                    )
                }
            })}
        </div>
    )
  }
}
