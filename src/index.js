import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Contact from './components/Contact/Contact'
import store from './redux/store'
import * as serviceWorker from './serviceWorker';

import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import {Provider} from 'react-redux'
import Navbar from './components/NavBar/NavBar'
import Home from './components/Home/Home'
import Sidebar from './components/Sidebar/Sidebar'
import Clients from './components/Clients/Clients'
import Settings from './components/Settings/Settings'
import Subscription from './components/Settings/Subscription/Subscription'
import Sessions from './components/Settings/Sessions/Sessions'

ReactDOM.render(
<Provider store={store}>
    <Router>
        <Switch>
            <Route exact path="/" 
            render={props => <Home {...props}/>}/>

            <Route path="/contact" render={(props) => {
                return (
                <div className="app">
                    <Navbar {...props}/>
                    <Contact/>
                </div>
                )
            }}/>

            <Route path="/dashboard" render={(props) => {
                return (
                    <div style={{display: 'flex'}}>
                        <Sidebar {...props}/>
                        <Clients/>
                    </div>
                )
            }}/>

            <Route exact path="/settings" render={(props) => {
                return (
                    <div style={{display: 'flex'}}>
                        <Sidebar {...props}/>
                        <Settings/>
                    </div>
                )
            }}/>

            <Route exact path="/settings/subscription" 
            render={(props) => {
                return (
                    <div style={{display: 'flex'}}>
                        <Sidebar {...props}/>
                        <Subscription/>
                    </div>
                )
            }}/>

            <Route exact path="/settings/sessions" 
            render={(props) => {
                return (
                    <div style={{display: 'flex'}}>
                        <Sidebar {...props}/>
                        <Sessions/>
                    </div>
                )
            }}/>
            
        </Switch>
    </Router>
</Provider>

, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
