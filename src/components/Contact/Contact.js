import React, { Component } from 'react'
import './Contact.css'
import axios from 'axios'

export default class Contact extends Component {
    constructor(){
      super()
      this.state = {
        name: '',
        email: '',
        inputMessage: ''
      }
    }

    sendMessage = () => {
      const {name, email, inputMessage} = this.state
      var message = { name, email, inputMessage }
      axios.post('/api/sendcontactemail', {message} ).then(() => {
        alert('Email sent! 🚀')
      })
    }

  render() {
    return (
      <div className="contact">

          <div className="title-header">
          <h1 className="contact-title">
          <i className="far fa-envelope"/> CONTACT US</h1>
          </div>

          <div className="contact-form-title">
            <p>We're currently looking for beta testers to help guide Looking Fox into the future. If you're a professional photographer who joins beta, you'll have lifetime access to the software! Limited spots available, so reach out soon!</p>
          </div>


          <div className="contact-form">

              <form>
                  <div class="form-row">

                        <div class="col">
                          <input type="text" class="form-control" placeholder="Name"
                          onChange={(e) => this.setState({name: e.target.value})}/>
                        </div>

                        <div class="col">
                          <input type="text" class="form-control" placeholder="Email"
                          onChange={(e) => this.setState({email: e.target.value})}/>
                        </div>

                  </div>

                  <textarea className="message-box" placeholder="Message"
                  onChange={(e) => this.setState({inputMessage: e.target.value})}/>

                  <button type="button" class="btn btn-dark send-button"
                  onClick={this.sendMessage}>Send</button>
                          
              </form>

          </div>

      </div>
    )
  }
}
