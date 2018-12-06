import React, { Component } from 'react'
import './Actions.css'
import axios from 'axios'


export default class Actions extends Component {
    constructor(){
        super()
        this.state = {
            actionItems: []
        }
    }

    componentDidMount(props){
        let newList = this.props.actionList
        this.setState({
            actionItems: newList
        })
    }

    //If all items are complete, change complete to true in DB.
    allItemsComplete = () => {
       
       var checkPromise = new Promise(resolve => {
        var allComplete = true
            this.state.actionItems.map(e => {
                
                if(e.completed===false){
                    allComplete = false
                } 
            })

            resolve(allComplete)
       })
        
        checkPromise.then((value) => {
            
            if(value !== this.props.actionsComplete){
                var clientId = this.props.id
                this.props.allChecked(clientId, value)
                axios.put('/api/clientcomplete', {clientId, completed: value})
            }
            
        })

    }

    //Status variable passed as arguement! Heads up.
    actionCheck = (id, index, completed, status=null) => {
        
        if(this.props.checkValues){

            if(completed===true) status=false
            else status=true

        axios.put('/api/updateaction', {id, status}).then(() => {
           
            
            var updatedActions = this.props.actionList.slice()
            updatedActions[index]["completed"] = status
            this.setState({ actionItems: updatedActions })

            this.allItemsComplete()
            
        })

    }
        else {
            alert("You can't complete something in your settings 🤷‍")
        }
        
    }
    
 render(props) {
    if(this.props.actionList){
        return (
            
            <div className="list">
                
                {this.props.actionList.map((e,i) => {
                    
            //NOTE: String not boolean for true in order to use aggregate function in SQL. 
                    if(e.completed===true && this.props.checkValues===true){
            //NOTE: Index value will not change since the order is important. So index will work as a key in this instance.
                        return (
                            <div className="action" key={e.id}
                            onClick={() => this.actionCheck(e.id, i, e.completed)}>
                                <i className="fas fa-check-circle"/>
                                <p>{e.name}</p>
                            </div>
                        )
                    }
                    else {
                        return (
                            <div className="action" key={e.id}
                        onClick={() => this.actionCheck(e.id, i, e.completed)}>
                                <i className="far fa-check-circle"/>
                                <p>{e.name}</p>
                            </div>
                        )
                    }
                })}
            </div>
        )    
     }     
     return <div className="loading center">Loading...</div>
    }
}
