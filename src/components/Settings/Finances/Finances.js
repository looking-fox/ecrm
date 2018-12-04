import React, { Component } from 'react'
import './Finances.css'
import Nav from '../Nav/Nav'
import axios from 'axios'
import {Bar} from 'react-chartjs-2';

export default class Finances extends Component {
  constructor(){
    super()
    this.state = {
      yearlyPayments: []
    }
 
  }

  componentDidMount(){
    let currentYear = new Date().getFullYear()
    axios.get(`/api/yearlypayments/${currentYear}`).then(response => {
      let convertedAmount = response.data.map(e => parseInt(e.total))
      this.setState({ yearlyPayments: convertedAmount })
    })
  }


  render() {
    const {yearlyPayments} = this.state
    var paymentsData = {
      labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      datasets: [
        {
          label: 'Payments',
          fillColor: "#1f1f1f",
          strokeColor: "#1f1f1f",
          data: yearlyPayments
        }
      ]
    };

    return (
      <div className="subdashboard">
        <Nav/>
        <div className="finance-container">

            <div className="macro-dashboard">
             le macro
            </div>

            <div className="year-graph">
              <Bar
              data={paymentsData}
              width={350}
	            height={350}
	            options={{ maintainAspectRatio: false	}}
              />
            </div>


            <div className="tax-container">
            le taxes
            </div>


            <div className="monthly-figures">
            le mes 
            </div>


        </div>
      </div>
    )
  }
}
