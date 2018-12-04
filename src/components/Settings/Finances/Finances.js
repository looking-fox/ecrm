import React, { Component } from 'react'
import './Finances.css'
import Nav from '../Nav/Nav'
import axios from 'axios'
import {Bar} from 'react-chartjs-2';
import {convertRawMoney} from '../../../redux/functions'

//TODO: 
  //macro numbers smaller
  //text added underneath tax title to explain what it does
  //dropdown in nav menu to select year for generating finance info

export default class Finances extends Component {
  constructor(){
    super()
    this.state = {
      yearlyPayments: [],
      yearPayStrings: [],
      macro: {}
    }
 
  }

  componentDidMount(){
    let currentYear = new Date().getFullYear()
    axios.get(`/api/yearlypayments/${currentYear}`).then(response => {
      let convertedAmount = response.data.map(e => parseInt(e.total))
      let stringAmount = convertedAmount.map(e => convertRawMoney(e))
      this.setState({ yearlyPayments: convertedAmount, yearPayStrings: stringAmount })
    })
    axios.get(`/api/yearlymacro/2019`).then(response => {
      let macro = response.data[0]
      for(var key in macro){
        let int = parseInt(macro[key])
        let stringInt = convertRawMoney(int)
        macro[key] = stringInt
      }
      this.setState({ macro })
    })
  }


  render() {
    const {yearlyPayments, macro} = this.state
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
            
             <div className="macro-category">
              <p className="small-title">paid</p>
              <p className="big-number paid">{macro.paid}</p>
             </div>

             <div className="macro-category">
              <p className="small-title">due</p>
              <p className="big-number">{macro.due}</p>
            </div>

            <div className="macro-category">
              <p className="small-title">total</p>
              <p className="big-number">{macro.total}</p>
            </div>

        </div>

            <div className="year-graph">
              <Bar
              data={paymentsData}
	            options={{ maintainAspectRatio: false	}}
              />
            </div>


            <div className="tax-container">
              <div className="tax-bubble">
                <p style={{fontSize: '1.1em', paddingBottom: '20px'}}>Generate Your Yearly Taxes!</p>
                <button className="btn btn-dark" disabled>
                    Coming Soon
                </button>
              </div>
            </div>


            <div className="monthly-figures">
              <div className="monthly-container">
                {this.state.yearPayStrings.map(e => {
                  return (
                    <div className="month-block">
                      {e}
                    </div>
                  )
                })}
              </div>
            </div>


        </div>
      </div>
    )
  }
}
