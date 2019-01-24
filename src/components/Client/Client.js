import React, { Component } from 'react'
import PropTypes from 'prop-types';
import Select from 'react-select'
import './Client.css'
import axios from 'axios';

const customStyles = {
  container: (provided, state) => ({
    ...provided,
    width: 200,
    height: 'fit-content',
    fontSize: '0.9em',
    lineHeight: 'normal',
    marginRight: '20px'
  }),
  control: (provided, state) => ({
    ...provided
  }),
  option: (provided, state) => ({
    ...provided,
    padding: 10
  })
}

export default class Client extends Component {
  constructor() {
    super()
    this.state = {
      optionsMenu: false
    }

    window.addEventListener("click", event => {
      if (event.target.id !== `client-edit-icon-${this.props.client.client_id}` && this.state.optionsMenu) {
        this.setState({ optionsMenu: false })
      }
    });

  }

  openOptionsMenu = () => {
    this.setState({ optionsMenu: !this.state.optionsMenu })
    this.props.openClientSettingsModal(this.props)
  }

  updateProgress = item => {
    const { value } = item;
    const { actionList } = this.props;
    const { session_id } = this.props.client;

    let index = actionList.findIndex(obj => {
      return obj.value === value;
    })

    axios.post('/api/updateprogress', { index, session_id }).then(() => {
      alert('we are back!')
    })
  }

  render() {
    const { name, client_id, session_name, session_color, session_price, date, location, session_id } = this.props.client
    const { actionList } = this.props;
    var openMenu = this.state.optionsMenu ? 'flex' : 'none'
    let formatDate;
    if (date) {

      //Removing the Z keeps the date from reverting back to prior day. 
      //Without removing Z 1/16/18 becomes 1/15/18. 

      let filterDate = date.replace(/Z/g, "")
      formatDate = new Date(filterDate).toLocaleDateString('en-US')
    } else {
      formatDate = ''
    }


    return (
      <div className="client-container center column">

        <div className="client">

          <div className="name item">
            <p>{name}</p>
          </div>

          <div className="package item small-item">
            <span className={`bubble ${session_color}`}>{session_name}</span>
          </div>

          <div className="date item small-item">
            <p>{formatDate}</p>
          </div>

          <div className="location item"
            onClick={() => this.props.goToMap(location)}>
            <p><i className="far fa-map" />{location}</p>
          </div>

          <div className="total item small-item"
            onClick={() => this.props.openPayments({ name, client_id, session_price, session_color })}>
            <p><i className="far fa-credit-card" />{session_price}</p>
          </div>

          <Select
            onChange={e => this.updateProgress(e)}
            options={actionList}
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

          <div className="settings">
            <i className="fas fa-ellipsis-h"
              id={`client-edit-icon-${client_id}`}
              onClick={this.openOptionsMenu} />

            <div className="options-menu client-edit"
              style={{ display: openMenu }}>

              <p onClick={() => this.props.openClientModal()}>
                <i className="far fa-edit" />edit</p>

              <p onClick={() => this.props.optDeleteModal(client_id, session_id)}
              ><i className="far fa-trash-alt" />delete</p>

            </div>
          </div>

        </div>

      </div>
    )
  }
}

Client.propTypes = {
  index: PropTypes.number.isRequired,
  client: PropTypes.object.isRequired,
  actionList: PropTypes.array.isRequired,
  goToMap: PropTypes.func.isRequired,
  openPayments: PropTypes.func.isRequired,
  openClientModal: PropTypes.func.isRequired,
  optDeleteModal: PropTypes.func.isRequired,
  openClientSettingsModal: PropTypes.func.isRequired
}