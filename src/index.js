import React from 'react';
import ReactDOM from 'react-dom';

import './reset.css';
import './index.css';
import './Main/Main.css';

import store from './redux/store'
import * as serviceWorker from './serviceWorker';

import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import { Provider } from 'react-redux'
import { StripeProvider } from 'react-stripe-elements';

import Navbar from './components/NavBar/NavBar'
import Home from './components/Home/Home'
import Contact from './components/Contact/Contact'
import Sidebar from './components/Sidebar/Sidebar'
import Clients from './components/Clients/Clients'
import Finances from './components/Settings/Finances/Finances'
import Sessions from './components/Settings/Sessions/Sessions'
import SignUp from './components/Subscription/SignUp'
let stripeId = null;

if (window.Stripe) {
    stripeId = window.Stripe(process.env.REACT_APP_STRIPE_PUB)
} else {
    document.querySelector('#stripe-js').addEventListener('load', () => {
        // Create Stripe instance once Stripe.js loads
        stripeId = window.Stripe(process.env.REACT_APP_STRIPE_PUB)
    });
}

ReactDOM.render(
    <StripeProvider stripe={stripeId}>
        <Provider store={store}>
            <Router>
                <Switch>
                    <Route exact path="/"
                        render={props => <Home {...props} />} />

                    <Route path="/contact" render={props => {
                        return (
                            <div className="app">
                                <Navbar {...props} />
                                <Contact />
                            </div>
                        )
                    }} />

                    <Route path="/dashboard" render={props => {
                        return (
                            <div style={{ display: 'flex' }}>
                                <Sidebar {...props} />
                                <Clients />
                            </div>
                        )
                    }} />

                    <Route path="/dashboard/welcome" render={props => {
                        return (
                            <div style={{ display: 'flex' }}>
                                <Sidebar {...props} />
                                <Clients />
                            </div>
                        )
                    }} />

                    <Route exact path="/tools/templates"
                        render={props => {
                            return (
                                <div style={{ display: 'flex' }}>
                                    <Sidebar {...props} />
                                    <Sessions />
                                </div>
                            )
                        }} />

                    <Route exact path="/tools/finances"
                        render={props => {
                            return (
                                <div style={{ display: 'flex' }}>
                                    <Sidebar {...props} />
                                    <Finances />
                                </div>
                            )
                        }} />

                    <Route exact path="/signup" render={props => (
                        <SignUp {...props} />
                    )} />

                </Switch>
            </Router>
        </Provider>
    </StripeProvider>

    , document.getElementById('root'));

serviceWorker.register();