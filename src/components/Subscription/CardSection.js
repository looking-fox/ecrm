import React, {Component} from 'react'
import { CardElement } from 'react-stripe-elements';

export default class CardSection extends Component {
  constructor(){
    super()
    this.cardRef = React.createRef()
  }
  render(){
    return (
      <div className="card-element-container">
        <CardElement ref={this.cardRef}
        style={{base: {fontSize: '18px', fontFamily: 'Open Sans'}}} />
      </div>
    )
  }
}




