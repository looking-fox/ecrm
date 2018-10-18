import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Contact from './components/Contact/Contact'
import store from './redux/store'
import * as serviceWorker from './serviceWorker';

import {HashRouter as Router, Switch, Route} from 'react-router-dom';
import {Provider} from 'react-redux'
import Sidebar from './components/Sidebar/Sidebar'
import Clients from './components/Clients/Clients'
import Pricing from './components/Pricing/Pricing'

ReactDOM.render(
<Provider store={store}>
    <Router>
        <Switch>
            <Route exact path="/" component={App}/>
            <Route path="/contact" component={Contact}/>

            <Route path="/dashboard" render={() => {
                return (
                    <div style={{display: 'flex'}}>
                        <Sidebar/>
                        <Clients/>
                    </div>
                )
            }}/>

            <Route path="/feedback" render={() => {
                return (
                    <div style={{display: 'flex'}}>
                        <Sidebar/>
                        <Pricing/>
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
