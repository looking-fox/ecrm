import React, { Component } from 'react'
import './FilterBar.css'
import Select from 'react-select'
import {connect} from 'react-redux'
import {updateProps} from '../../../redux/reducer'

//Sort Options: Sort by date, by name, by most recent, 
//Filter Options: Completed, Incomplete, session types
const options = [
  { value: 'recent', label: 'Most Recent' },
  { value: 'name', label: 'Name' },
  { value: 'date', label: 'Date' }
]

const customStyles = {
  container: (provided, state) => ({
    ...provided,
    width: 150
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
  
  updateSort = (value) => {
    let newFilterBar = Object.assign({}, this.props.filterBar)
    newFilterBar.sort = value
    this.props.updateProps({ filterBar: newFilterBar })
  }

  render() {
    return (
      <div className="filter-bar">
            
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
    )
  }
}

function mapStateToProps(state){
    return {
        ...this.props, ...state
    }
}

export default connect(mapStateToProps, {updateProps})(FilterBar)
