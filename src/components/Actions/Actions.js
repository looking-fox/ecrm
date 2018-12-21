import React, { Component } from 'react'
import './Actions.css'
import axios from 'axios'
import PropTypes from 'prop-types';

export default class Actions extends Component {
    constructor(){
        super()
        this.state = {
            actionItems: []
        }
    }

    //If all items are complete, change complete to true in DB.
    allItemsComplete = () => {
       
       var checkPromise = new Promise(resolve => {
        var allComplete = true
            this.state.actionItems.map(e => {
                
                if(e.check===false){
                    allComplete = false
                } 
            })

            resolve(allComplete)
       })
        
        checkPromise.then((value) => {
            
            if(value !== this.props.actionsComplete){
                var clientId = this.props.id
                this.props.allChecked(clientId, value)
                axios.put('/api/clientcomplete', {clientId, check: value})
            }
            
        })

    }

    //Status variable passed as arguement! Heads up.
    actionCheck = (index, check, status=null) => {
        
        if(this.props.checkValues){

            if(check===true) status=false
            else status=true

        axios.put('/api/updateaction', {index, status}).then(() => {
           
            
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
    
 render() {
        return (
            
            <div className="list">
                
                {this.props.actionList.map((e,i) => {
                    console.log('al', this.props.actionList)
                    if(e.check===true && this.props.checkValues===true){
                        return (
                            <div className="action" key={i}
                            onClick={() => this.actionCheck(i, e.check)}>
                                <i className="fas fa-check-circle"/>
                                <p>{e.name}</p>
                            </div>
                        )
                    }
                    
                    else {
                        return (
                            <div className="action" key={i}
                        onClick={() => this.actionCheck(i, e.check)}>
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

Actions.propTypes = {
    id: PropTypes.number,
    actionsComplete: PropTypes.bool,
    checkValues: PropTypes.bool.isRequired,
    allChecked: PropTypes.func,
    actionList: PropTypes.array.isRequired
}


