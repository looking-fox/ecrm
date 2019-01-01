import React from 'react'
import './Home.css'
import {login} from '../../Main/MainLogic'
import Workspace from '../../assets/Workspace5.jpg'
import Navbar from '../NavBar/NavBar'
import Features from '../Features/Features'
import Footer from '../Footer/Footer'
import Fade from 'react-reveal/Fade'

export default function Home(props){
    return (
      <div className="home" data-test="comp-home">
      <Navbar {...props}/>
      
        <div className="body">
            <Fade left>

            <div className="intro-container">
                <h3 className="intro-text">
                  Keep organized. 
                  <br/>
                  Stay adventurous.
                </h3>

                <h5 className="join-now">
                Join beta. Lock in <b>$3/month</b> pricing.
                </h5>

                <button className="btn btn-outline-dark join-btn"
                onClick={login} data-test="log-in-btn">
                  Sign Up
              </button>

            </div>
            
            </Fade>

            <Fade>
              <img className ="main-image" src={Workspace} alt="Home office workspace"/>
            </Fade>
        </div>

        <Features {...props}/>
        <Footer/>

      </div>
    )
  }

