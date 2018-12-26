import React, { Component } from 'react'
import './Tutorial.css'
import Modal from 'react-responsive-modal'
import firstDemo from '../../../assets/1.gif'
import secondDemo from '../../../assets/2.gif'
import thirdDemo from '../../../assets/3.gif'
import fourthDemo from '../../../assets/4.gif'
import fifthDemo from '../../../assets/5.gif'


export default class Tutorial extends Component {
    constructor(){
        super()
        this.state = {
            progress: [
                {complete: true, id: 'a'},
                {complete: false, id: 'b'},
                {complete: false, id: 'c'},
                {complete: false, id: 'd'},
                {complete: false, id: 'e'}
            ],
            currentIndex: 0
        }

        window.addEventListener("keydown", e => {
            if(e.keyCode === 39){
               this.goForward()
            }
            if(e.keyCode === 37){
                this.goBack()
            }
        });
    }

    goForward = () => {
        const {currentIndex, progress} = this.state
    if(currentIndex < 4){
       let newIndex = currentIndex + 1
       progress[newIndex].complete = true
       this.setState({ progress, currentIndex: newIndex })
      }
    }

    goBack = () => {
        const {currentIndex, progress} = this.state
    if(currentIndex > 0){
        let newIndex = currentIndex
        progress[newIndex].complete = false
        newIndex -= 1
        this.setState({ progress, currentIndex: newIndex })
      }
    }

    renderDescription = () => {
        const {currentIndex} = this.state
        switch(currentIndex){
            case 0:
            return (
                <p>We have a few things to set up. Once we're done, it should be easier to keep track of your clients! To start, click on your user icon, and then  <i className="fas fa-wrench"/> to set up your first session template. </p>
            )
            case 1:
            return (
                <p>You can set up a default price, color, and to-do list. Every client is customizable. But having templates makes life easier. </p>
            )
            case 2: 
            return (
                <center><p>To create a client list, hover over Clients and click  <i className="fas fa-plus-circle"/>. You can edit, delete, or rearrange your lists from here too.</p></center>
            )
            case 3:
            return (
                <p>Once you've created a list, you can add clients by selecting it, and clicking <i className="fas fa-plus-circle"/>. Assign a session template, date, location, and custom price if needed. You can always edit a client at any stage in the process.</p>
            )
            case 4:
            return (
                <p>Keep track of payments by clicking on  <i className="far fa-credit-card"/> for each client.</p>
            )
            
            default: 
            return (<p>We have a few things to set up to get started. But once we complete these steps, it should be a lot easier to keep track of clients! To start, you'll head to Tools > Templates. </p>)
        }
    }

    renderDemo = () => {
        const {currentIndex} = this.state
        switch(currentIndex){
            case 0:
            return firstDemo
            case 1:
            return secondDemo
            case 2: 
            return thirdDemo
            case 3: 
            return fourthDemo
            case 4:
            return fifthDemo
            default:
            return firstDemo
        }
    }

  render() {
      const {showTutorial, hideTutorial} = this.props
    return (
        <Modal center open={showTutorial} onClose={hideTutorial}>
            <div className="tutorial-container align-center column">
                <h3 className="title">
                     Welcome to Looking Fox!
                </h3>

                <div className="image-container center">
                <img 
                className="demo-gif" 
                alt="Settings Demonstration"
                src={this.renderDemo()}/>

                </div>

                <div className="description">
                   <p>{this.renderDescription()}</p>
                </div>
                
                {/* Bottom Navigation */}
                
                <div className="progress align-center">
                    {this.state.progress.map( e => {
                        if(e.complete){
                            return (
                            <div className="circle fill" key={e.id}>
                            </div>
                            )
                        }
                        else {
                            return (
                            <div className="circle unfill" key={e.id}>
                            </div>
                            )
                        }
                    })}
                </div>

                <i className="fas fa-arrow-left back arrow" onClick={this.goBack}/>

                {this.state.currentIndex === 4 ? 
                <button type="button" className="btn btn-dark done-button"
                onClick={() => hideTutorial()}>Done</button>
                :
                <i className="fas fa-arrow-right forward arrow" onClick={this.goForward}/>
                }
                
                 {/* Bottom Navigation */}

            </div>
        </Modal>
    )
  }
}
