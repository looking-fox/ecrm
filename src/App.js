import React, { Component } from 'react';
import './reset.css'
import './App.css'
import Home from './components/Home/Home'

class App extends Component {
  render() {
    return (
      <div className="container-fluid background">
        <Home/>
      </div>
    )
  }
}

export default App;
