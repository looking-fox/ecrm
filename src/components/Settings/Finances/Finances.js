import React, { Component } from 'react'
import './Finances.css'
import Nav from '../Nav/Nav'
import axios from 'axios'
import {Line} from 'react-chartjs-2';
import Select from 'react-select'
import {convertRawMoney} from '../../../redux/functions'

  const options = [
    { value: 2018, label: '2018' },
    { value: 2019, label: '2019' },
    { value: 2020, label: '2020' },
  ]
  
  const customStyles = {
    container: (provided, state) => ({
      ...provided,
         width: 200,
         height: 'fit-content',
         fontSize: '0.9em',
         lineHeight: 'normal'
    }),
    control: (provided, state) => ({
      ...provided
    }),
    option: (provided, state) => ({
      ...provided,
      padding: 10
    })
  }

export default class Finances extends Component {
  constructor(){
    super()
    this.state = {
      yearlyPayments: [],
      yearPayStrings: [],
      totalPaid: 0,
      currentYear: null
    }
  }

  componentDidMount(){
    let currentYear = new Date().getFullYear()
    this.setState({ currentYear }, () => this.getYearInfo() )
  }

  //Retrieves payments within a year, returned as array of monthly sums for every MO of year. 
  // Example: [{1: 240}] = January: $240 total payments. 
  getYearInfo = () => {
    const {currentYear} = this.state
    axios.get(`/api/yearlypayments/${currentYear}`).then(response => {
      let intAmount = response.data.map(e => parseInt(e.total))
      let stringAmount = intAmount.map(e => convertRawMoney(e))
      let sum = intAmount.reduce((acc, e) => acc += e)
      this.setState({ yearlyPayments: intAmount, yearPayStrings: stringAmount, totalPaid: sum, currentYear })
    })
  }

  loadNewYear = (year) => {
    this.setState({currentYear: year}, () => this.getYearInfo() )
  }

  render() { 
    const {yearlyPayments, totalPaid, currentYear} = this.state
    var paymentsData = {
      labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      datasets: [
        {
          label: 'Payments',
          borderColor: "#fff",
          fillColor: "#fff",
          strokeColor: "#fff",
          pointColor: "#fff",
          pointStrokeColor: "#fff",
          pointHighlightFill: "#fff",
          pointHighlightStroke: "#fff",
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
                  <p className="big-number paid">{convertRawMoney(totalPaid)}</p>
                </div>

                <div className="macro-category">
                  <p className="small-title">AVG / MO</p>
                  <p className="big-number">{convertRawMoney(Math.round(totalPaid/12))}</p>
                </div>
            </div>

            <div className="year-graph">
              <Line
              ref={this.myChart}
              data={paymentsData}
	            options={{
                maintainAspectRatio: false,
                tooltips: {enabled: false},
                legend: {display: false},
                title: {
                    display: false,
                    fontColor: 'blue',
                    text: 'Custom Chart Title'
                }     ,
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true,
                            fontColor: 'white'
                        },
                    }],
                  xAxes: [{
                        ticks: {
                            fontColor: 'white'
                        },
                    }]
                } 
        
            	}}
              />
            </div>


            <div className="tax-container">
              <div className="tax-bubble">
                <p style={{fontSize: '1.1em', paddingBottom: '20px'}}>Taxes!</p>
                <p style={{paddingBottom: '20px', lineHeight: '20px'}}>Generate an organized report of all of your recorded payments for tax season.</p>
                <button className="btn btn-dark" disabled>
                    Coming Soon
                </button>
              </div>
            </div>


            <div className="monthly-figures">
              <div className="monthly-container">
                {this.state.yearPayStrings.map((e,i) => {
                  return (
                    <div className="month-block" key={i}>
                      <p className="month-total">{e}</p>
                      <p className="month-name">
                        {paymentsData.labels[i]}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="year-dropdown">
                <Select 
                onChange={ e => this.loadNewYear(e.value)}
                defaultValue={this.state.currentYear}
                placeholder={this.state.currentYear}
                options={options}
                styles={customStyles}
                isSearchable={false}
                theme={(theme) => ({
                  ...theme,
                  colors: {
                  ...theme.colors,
                    primary25: '#eeeeee',
                    primary: 'black'
                  },
                })} />
            </div>

        </div>
      </div>
    )
  }
}
