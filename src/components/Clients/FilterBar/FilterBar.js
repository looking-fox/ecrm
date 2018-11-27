import React, { Component } from 'react'
import './FilterBar.css'
import Select from 'react-select'
import {connect} from 'react-redux'
import {updateProps} from '../../../redux/reducer'
import axios from 'axios'


//Sort Options: Sort by date, by name, by most recent, 
//Filter Options: Completed, Incomplete, session types


const options = [
  { value: 'recent', label: <p className="menu-text"><i className="far fa-clock"/> Most Recent </p> },
  { value: 'name', label: <p className="menu-text"><i className="fas fa-sort-alpha-down"/> Name </p> },
  { value: 'date', label: <p className="menu-text"><i className="far fa-calendar"/> Date </p> }
]


const customStyles = {
  container: (provided, state) => ({
    ...provided,
       width: 200,
       height: 'fit-content',
       fontSize: '0.9em'
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
      sessionOptions: [{ value: 0, label: 'All Sessions' }]
    }
  }
  
  componentDidMount(){
    axios.get('/api/getsessiontypes').then(response => {
      var newSessions = response.data.map(e => {
        return {value: e.session_name, label: e.session_name}
      })
      var updatedList = this.state.sessionOptions.slice().concat(newSessions)
      console.log('updatedList: ', updatedList)
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
