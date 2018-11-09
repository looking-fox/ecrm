import React, { Component } from 'react';

import './reset.css'
import Home from './components/Home/Home'

class App extends Component {
  render(props) {
    return (
      <Home {...props}/>
    )
  }
}

export default App;
