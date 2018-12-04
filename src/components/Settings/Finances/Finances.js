import React, { Component } from 'react'
import './Finances.css'
import Nav from '../Nav/Nav'
var Charts = require("react-chartjs")

var paymentsData = {
	labels: ["January", "February", "March", "April", "May", "June", "July"],
	datasets: [
		{
			label: "Payments Received",
			fillColor: "#323232",
			strokeColor: "#323232",
			highlightFill: "rgba(220,220,220,0.75)",
			highlightStroke: "rgba(220,220,220,1)",
			data: [65, 59, 80, 81, 56, 55, 40]
    }
	]
};


export default class Finances extends Component {
  render() {
    return (
      <div className="subdashboard">
        <Nav/>
        <div className="year-graph">
          <Charts.Bar 
          data={paymentsData}
          width="600"
          height="250"/>
        </div>
      </div>
    )
  }
}
