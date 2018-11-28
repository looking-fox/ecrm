import React, { Component } from 'react'
import './FilterBar.css'
import Select from 'react-select'
import {connect} from 'react-redux'
import {updateProps} from '../../../redux/reducer'
import axios from 'axios'
import DateRangePicker from '@wojtekmaj/react-daterange-picker'

//Sort Options: Sort by date, by name, by most recent, 
//Filter Options: Completed, Incomplete, session types

const options = [
  { value: 'date', label: <p className="menu-text"><i className="far fa-calendar"/> Chronological</p> },
  { value: 'name', label: <p className="menu-text"><i className="fas fa-sort-alpha-down"/> Name </p> }
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

class FilterBar extends Component {
  constructor(){
    super()
    this.state = {
      sessionOptions: [{ value: 0, label: 'All Sessions' }],
      date: [new Date(), new Date()]
    }
  }
  
  componentDidMount(){
    axios.get('/api/getsessiontypes').then(response => {
      var newSessions = response.data.map(e => {
        return {value: e.session_name, label: e.session_name}
      })
      var updatedList = this.state.sessionOptions.slice().concat(newSessions)
      this.setState({ sessionOptions: updatedList })
    })
  }

  updateSort = (value) => {
    let newFilterBar = Object.assign({}, this.props.filterBar)
    newFilterBar.sort = value
    this.props.updateProps({ filterBar: newFilterBar })
  }

  updateSessionSort = (value) => {
    let newFilterBar = Object.assign({}, this.props.filterBar)
    newFilterBar.sortSession = value
    this.props.updateProps({ filterBar: newFilterBar})
  }

  //Convert date value to ['10', '04', '2019] format and store as start, end keys on dateRange object. or Inactive if no value.
  updateDateSort = (value) => {
      this.setState({date: value})
      let newFilterBar = Object.assign({}, this.props.filterBar)

      if(value){
        let start = value[0].toLocaleDateString().split('/')
        let end = value[1].toLocaleDateString().split('/')
        let dateRange = {start, end}
        newFilterBar.dateRange = dateRange
      }
      else {
        newFilterBar.dateRange = {inactive: true}
      }
      this.props.updateProps({ filterBar: newFilterBar })
  }

  render() {
    
    return (
      <div className="filter-bar">
            
            <div className="menu">
            <Select 
            onChange={ e => this.updateSessionSort(e)}
            defaultValue={this.props.filterBar.sortSession}
            options={this.state.sessionOptions}
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

            <div className="menu">
            <DateRangePicker
            className="date-picker-menu"
            maxDetail={"year"}
            onChange={e => this.updateDateSort(e)}
            value={this.state.date}/>
           </div>

            <div className="menu">
            <Select 
            onChange={ e => this.updateSort(e)}
            defaultValue={this.props.filterBar.sort}
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
    )
  }
}

function mapStateToProps(state){
    return {
        ...this.props, ...state
    }
}

export default connect(mapStateToProps, {updateProps})(FilterBar)
