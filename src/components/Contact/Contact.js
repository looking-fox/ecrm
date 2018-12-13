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
        this.setState({
          name: '',
          email: '',
          inputMessage: ''
        })
        document.getElementById("contact-form-control").reset();
        alert('Email sent! 🚀')
      })
    }

  render() {
    return (
      <div className="contact align-center column">

          <div className="title-header center">
          <h1 className="contact-title">
          <i className="far fa-envelope"/> CONTACT US</h1>
          </div>

          <div className="contact-form-title">
            <p>If you have any questions about Looking Fox, or curious about becoming a brand ambassador--please fill out our contact form. We'll get back to you as soon as we can.</p>
          </div>


          <div className="contact-form">

              <form id="contact-form-control">
                  <div className="form-row">

                        <div className="col">
                          <input type="text" className="form-control" placeholder="Name"
            
                          onChange={(e) => this.setState({name: e.target.value})}/>
                        </div>

                        <div className="col">
                          <input type="text" className="form-control" placeholder="Email"
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
