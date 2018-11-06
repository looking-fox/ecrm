import React, { Component } from 'react'
import './Actions.css'
import axios from 'axios'

export default class Actions extends Component {
    constructor(props){
        super(props)
        this.state = {
            actions: [],
            clientId: null
        }
    }
    
    componentDidMount(){
        if(this.props.actionList) this.renderActions()
    }
    
    componentDidUpdate(prevProps){
        if(prevProps !== this.props) this.renderActions()
    }

    renderActions(){
        
        // var items = this.props.actionList["actions"]
        // var clientId = this.props.actionList["actions"][0]["client_id"]
        
        // this.setState({
        //     actions: items,
        //     clientId: clientId
        // })
    
    }


    actionCheck = (id, index, status=null) => {
        if(this.props.checkValues){

        let item = this.state.actions[index]["completed"]

        if(item==="true") status="false"
        else {
            status="true"
        }

        axios.put('/api/updateaction', {id, status}).then(() => {
            let newActions = this.state.actions
            newActions[index]["completed"] = status
            this.setState({actions: newActions})
        })

    }
        else {
            alert("You can't complete something in your settings 🤷‍")
        }
        
    }
    
 render(props) {
    console.log('state', this.state)
        return (
            //MISSING: Click action item changes UI, updates in DB.
            
            <div className="list">
                
                {this.state.actions.map((e,i) => {
                    
            //NOTE: String not boolean for true in order to use aggregate function in SQL. 
                    if(e.completed==="true" && this.props.checkValues){
            //NOTE: Index value will not change since the order is important. So index will work as a key in this instance. Trade Off: React says this is a last resort. But it's not necessary and requires more data for no improvement in this instance. 
                        return (
                            <div className="action" key={e.id}
                            onClick={() => this.actionCheck(e.id, i)}>
                                <i className="fas fa-check-circle"/>
                                <p>{e.name}</p>
                            </div>
                        )
                    }
                    else {
                        return (
                            <div className="action" key={e.id}
                        onClick={() => this.actionCheck(e.id, i)}>
                                <i className="far fa-check-circle"/>
                                <p>{e.name}</p>
                            </div>
                        )
                    }
                })}
            </div>
        )
    
  }
}
