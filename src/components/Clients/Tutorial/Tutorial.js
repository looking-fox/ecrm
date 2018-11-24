import React, { Component } from 'react'
import './Tutorial.css'
import Modal from 'react-responsive-modal'
import firstDemo from '../../../assets/demo1.png'
import secondDemo from '../../../assets/demo2.png'
import thirdDemo from '../../../assets/demo3.png'
import fourthDemo from '../../../assets/demo4.png'
import fifthDemo from '../../../assets/demo5.png'

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
                <p>We have a few things to set up to get started. But once we complete these steps, it should be a lot easier to keep track of clients! To start, you'll head to Settings > Sessions. </p>
            )
            case 1:
            return (
                <p>Now you'll want to set up your sessions, which act like templates. You can set up a default price, color, and to-do list. Every client is customizable. But having templates makes life easier. </p>
            )
            case 2: 
            return (
                <center><p>To create a client list, hover over Clients and click the + symbol.</p></center>
            )
            case 3:
            return (
                <p>Once you've created a client list, you can add clients by selecting a list, and clicking on the + symbol. You can also edit, delete, or rearrange your lists from here, too.</p>
            )
            case 4:
            return (
                <p>When adding a client, you can assign a session template and customize it to fit. Whether they have a custom price, or you need to add a couple of to-do items. You can always edit a client at any stage in the process. </p>
            )
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
        }
    }

  render() {
      const {showTutorial, hideTutorial} = this.props
    return (
        <Modal center open={showTutorial} onClose={hideTutorial}>
            <div className="tutorial-container">
                <h3 className="title">
                     Welcome to Looking Fox!
                </h3>

                <div className="image-container">
                <img 
                className="demo-gif" 
                alt="Settings Demonstration"
                src={this.renderDemo()}/>

                </div>

                <div className="description">
                   {this.renderDescription()}
                </div>
                
                {/* Bottom Navigation */}
                
                <div className="progress">
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

                <i className="fas fa-arrow-right forward arrow" onClick={this.goForward}/>


                 {/* Bottom Navigation */}

            </div>
        </Modal>
    )
  }
}
