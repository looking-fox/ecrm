import React, { Component } from 'react'
import './FilterBar.css'
import {connect} from 'react-redux'
import {updateProps} from '../../../redux/reducer'

//Sort Options: Sort by date, by name, by most recent, 
//Filter Options: Completed, Incomplete, session types


class FilterBar extends Component {

  updateSort = (value) => {
    let newFilterBar = Object.assign({}, this.props.filterBar)
    newFilterBar.sort = value
    this.props.updateProps({ filterBar: newFilterBar })
  }

  render() {
    return (
      <div className="filter-bar">
            <select
            onChange={e => this.updateSort(e.target.value)}>
                <option value="recent">Most Recent</option>
                <option value="name">Name</option>
                <option value="date">Date</option>
            </select>
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
