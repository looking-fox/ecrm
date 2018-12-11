import React from 'react'
import './Home.css'
import Workspace from '../../assets/Workspace5.png'
import Navbar from '../NavBar/NavBar'
import Features from '../Features/Features'
import Footer from '../Footer/Footer'
import Fade from 'react-reveal/Fade'
import { mobileCheck } from '../../redux/functions'

export default function Home(props){
    return (
      <div className="home">
      <Navbar {...props}/>
      
        <div className="body">
            <Fade left>

            <div className="intro-container">
                <h3 className="intro-text">
                  Keep organized. 
                  <br/>
                  Stay {window.mobileCheck ? 'true' : 'false'}
                </h3>

                <h5 className="join-now">
                Join beta. Lock in <b>$3/month</b> pricing.
                </h5>

                 <button className="btn btn-outline-dark join-btn">
                Sign Up
                </button>
            </div>
            
            </Fade>

            <Fade>
              <img className ="main-image" src={Workspace} alt="Yosemite Elopement"/>
            </Fade>
        </div>

        <Features {...props}/>
        <Footer/>

      </div>
    )
  }

