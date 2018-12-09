import React from 'react'
import { CardElement } from 'react-stripe-elements';

export default function CardSection() {
    return (
      <div className="card-element-container">
        <CardElement style={{base: {fontSize: '18px', fontFamily: 'Open Sans'}}} />
      </div>
    )
}




