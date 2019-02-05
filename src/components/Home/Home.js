import React, { Suspense } from "react";
import "./Home.css";
import { login } from "../../Main/MainLogic";
import Navbar from "../NavBar/NavBar";
import Footer from "../Footer/Footer";
import Fade from "react-reveal/Fade";
import LazyLoad from 'react-lazyload';
import Workspace from '../../assets/Workspace5.jpg'
const Features = React.lazy(() => import('../Features/Features'))

export default function Home(props) {
  return (
    <div className="home" data-test="comp-home">
      <Navbar {...props} />

      <div className="body">
        <Fade left>
          <div className="intro-container">
            <h3 className="intro-text">
              Keep organized.
              <br />
              Stay adventurous.
            </h3>

            <h5 className="join-now">
              Join beta. Lock in <b>$3/month</b> pricing.
            </h5>

            <button
              className="btn btn-outline-dark join-btn"
              onClick={login}
              data-test="log-in-btn"
            >
              Sign Up
            </button>
          </div>
        </Fade>

        <LazyLoad>
          <Fade>
            <img
              src={Workspace}
              className="main-image"
              alt="Main office workspace" />
          </Fade>
        </LazyLoad>


      </div>

      <Suspense fallback={""}>
        <Features {...props} />
      </Suspense>

      <Footer />
    </div>
  );
}