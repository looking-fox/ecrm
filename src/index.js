import React from 'react';
import ReactDOM from 'react-dom';

import './reset.css';
import './main.css';
import './index.css';


import store from './redux/store'
import { unregister } from './serviceWorker';

import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import {Provider} from 'react-redux'
import {StripeProvider} from 'react-stripe-elements';

import Navbar from './components/NavBar/NavBar'
import Home from './components/Home/Home'
import Contact from './components/Contact/Contact'
import Sidebar from './components/Sidebar/Sidebar'
import Clients from './components/Clients/Clients'
import Finances from './components/Settings/Finances/Finances'
import Sessions from './components/Settings/Sessions/Sessions'
import Subscription from './components/Subscription/Subscription'

ReactDOM.render(
<StripeProvider apiKey={process.env.REACT_APP_STRIPE_PUB}>
<Provider store={store}>
    <Router>
        <Switch>
            <Route exact path="/" 
            render={props => <Home {...props}/>} />

            <Route path="/contact" render={ props => {
                return (
                <div className="app">
                    <Navbar {...props}/>
                    <Contact/>
                </div>
                )
            }}/>

            <Route path="/dashboard" render={ props => {
                return (
                    <div style={{display: 'flex'}}>
                        <Sidebar {...props}/>
                        <Clients/>
                    </div>
                )
            }}/>

            <Route path="/dashboard/welcome" render={ props => {
                return (
                    <div style={{display: 'flex'}}>
                        <Sidebar {...props}/>
                        <Clients/>
                    </div>
                )
            }}/>

            <Route exact path="/tools/templates" 
            render={ props => {
                return (
                    <div style={{display: 'flex'}}>
                        <Sidebar {...props}/>
                        <Sessions/>
                    </div>
                )
            }}/>

            <Route exact path="/tools/finances" 
            render={ props => {
                return (
                    <div style={{display: 'flex'}}>
                        <Sidebar {...props}/>
                        <Finances/>
                    </div>
                )
            }}/>

            <Route exact path="/sub" component={Subscription}/>
 
        </Switch>
    </Router>
</Provider>
</StripeProvider>

, document.getElementById('root'));

unregister();