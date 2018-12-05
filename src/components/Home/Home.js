import React from 'react'
import './Home.css'
import Workspace from '../../assets/Workspace5.png'
import Navbar from '../NavBar/NavBar'
import Features from '../Features/Features'
import Footer from '../Footer/Footer'
import Fade from 'react-reveal/Fade'

export default function Home(props){
    return (
      <div className="home">
      <Navbar {...props}/>

        <div className="body">
            <Fade bottom>
            <h3 className="introtext">Keep organized. <br/>Stay adventurous.</h3>
            </Fade>

            <img className ="mainimage" src={Workspace} alt="Yosemite Elopement"/>
        </div>

        <Features {...props}/>
        <Footer/>

      </div>
    )
  }

