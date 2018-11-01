import React, { Component } from 'react'
import './Actions.css'


export default class Actions extends Component {
    constructor(props){
        super(props)
        this.state = {
            actions: [],
            clientId: null
        }
    }
    
    

    componentDidUpdate(prevProps){
        if(prevProps !== this.props){
            var items = this.props.actionList["array_agg"]
            var clientId = this.props.actionList["array_agg"][0]["client_id"]
            this.setState({
                actions: items,
                clientId: clientId
            })
        }
    }

    actionCheck = (id) => {
        console.log(id)
    }
    
 render(props) {
   
        return (
            //MISSING: Click action item changes UI, updates in DB.
            
            <div className="list">
                {this.state.actions.map((e,i) => {
                    
                    if(e.completed==="true"){
            //NOTE: Index value will not change since the order is important. So index will work as a key in this instance. Trade Off: React says this is a last resort. But it's not necessary and requires more data for no improvement in this instance. 
                        return (
                            <div className="action" key={e.id}
                            onClick={() => this.actionCheck(e.id)}>
                                <i className="fas fa-check-circle"/>
                                <p>{e.name}</p>
                            </div>
                        )
                    }
                    else {
                        return (
                            <div className="action" key={e.id}
                            onClick={() => this.actionCheck(e.id)}>
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
