import React, { Component } from 'react'
import './Clients.css'
import Client from '../Client/Client'
import Actions from '../Actions/Actions'
import ClientModal from './ClientModal/ClientModal'
import ClientSettingsModal from './ClientSettingsModal/ClientSettingsModal'
import FilterBar from './FilterBar/FilterBar'
import PaymentModal from './PaymentModal/PaymentModal'
import Loading from './Loading'
import axios from 'axios';
import { connect } from 'react-redux'
import { updateClients, updateClientModal, updateClientSettingsModal, updateProps } from '../../redux/reducer'
var loadTimeOut;

class Clients extends Component {
  constructor() {
    super()
    this.state = {
      clients: [],
      noClients: false,
      loadingClients: false,
      sessions: [],
      sessionTypes: [],
      sessionPrice: '',
      deleteVerify: false,
      deleteInfo: {},
      showTutorial: false,
    }

  }

  componentDidMount() {
    this.getClients()
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {

      //If we change to All Clients--get new clients.
      if (prevProps.listId !== this.props.listId) {
        if (this.props.listId === -1) {
          this.getClients()
        }
      }
      //If Props.Clients change, update state. 
      else if (prevProps.clients !== this.props.clients) {
        const { clients } = this.props
        this.setState({ clients })
      }
    }
  }

  componentWillUnmount() {
    clearTimeout(loadTimeOut)
  }

  getClients = () => {
    //IF: 0 clients, render tutorial pop up.
    //ELSE: map clientIds as keys for clients object (store in props)
    //NOTE: Render Loading if axios call takes longer than 300ms via loadTimeOut variable.

    axios.get('/api/getclients').then(response => {
      var clients = response.data
      let firstClient = response.data[0]

      if (firstClient) {
        if (firstClient.client_id === null) loadIntro()

        else {
          this.setState({ loadingClients: false }, () => {
            this.props.updateClients({ clients })
          })
        }
      }
      else loadIntro()
    })


    //-----Get Client Functions----//
    var loadIntro = () => {
      this.setState({ loadingClients: false }, () => {
        this.props.updateClients({ noClients: true })
      })
    }

    loadTimeOut = setTimeout(() => {
      if (!this.props.clients.length && !this.props.noClients) {
        this.setState({ loadingClients: true })
      }
    }, 200)
    //-----Get Client Functions----//
  }

  goToMap = (location) => {
    //Format for Google URL String and Open in New Tab
    var convertedLocation = location
      .replace(/[,]+/g, "")
      .replace(/[ ]+/g, "+")
      .replace(/[&]+/g, "%26")

    let url = `https://www.google.com/maps/place/${convertedLocation}`

    window.open(url, '_blank')
  }

  openPayments = (info) => {
    const { name, client_id, session_price, session_color } = info
    let newPaymentInfo = { open: true, clientId: client_id, name: name, sessionPrice: session_price, sessionColor: session_color }
    this.props.updateProps({ paymentModal: newPaymentInfo })
  }

  openClientSettingsModal = (client) => {
    this.props.updateClientSettingsModal({
      clientSettingsModal: {
        open: true, newClient: false,
        client: client
      }
    })

  }

  openClientModal = () => {
    this.props.updateClientModal({ clientModalOpen: true })
  }

  optDeleteModal = (client_id, session_id) => {
    this.setState(() => {
      if (client_id && session_id) {
        return {
          deleteVerify: !this.state.deleteVerify,
          deleteInfo: { client_id, session_id }
        }
      }
      else {
        return {
          deleteVerify: !this.state.deleteVerify,
          deleteInfo: {}
        }
      }
    })
  }

  deleteClient = (clientId) => {
    let currentSessions = this.state.sessions
    delete currentSessions[clientId]
    this.setState({ sessions: currentSessions })
  }

  allItemsChecked = (clientId, value) => {
    var index = this.props.clients.findIndex(element => {
      return element.client_id === clientId
    })
    var updatedClients = this.props.clients.slice()
    updatedClients[index]["completed"] = value

    this.props.updateClients({ clients: updatedClients })
  }

  renderClients() {
    //If we have zero clients, we don't want to map and render the Client or Actions components
    const { sort, sortSession, sortName, dateRange } = this.props.filterBar

    let firstClient = this.props.clients[0]

    if (firstClient) {

      if (firstClient.client_id !== null) {

        return this.props.clients
          //Filter clients based on List ID.
          .filter(e => {
            if (this.props.listId === -1) return true
            else return e.list_id === this.props.listId
          })

          //If actively filtering sessions, filter by session_name. IDs are per client. Name is consistent var for this case. 
          .filter(e => {
            if (sortSession.value !== 0) {
              if (e.session_name === sortSession.value) return true
              else return false
            }
            else return true
          })

          .filter(e => {
            if (dateRange.start) {
              const { start, end } = dateRange
              if (e.date >= start && e.date <= end) return true
              else return false
            }
            else return true
          })

          .filter(e => {
            if (sortName) {
              return e.name.toUpperCase().includes(sortName.toUpperCase())
            }
            else return true
          })

          //Sort by date (default) or by name.
          .sort((a, b) => {
            const { value } = sort
            if (value === 'name') {
              if (a.name < b.name) return -1
              else return 1
            }

            if (value === 'date') {
              if (a.date < b.date) return -1
              else return 1
            }
            //Defaul Case for Sorting if No Conditions Are True
            return 1;
          })

          //Sort completed clients to bottom of list
          .sort((a, b) => {
            return a.completed - b.completed
          })

          .map((e, i) => {

            return (
              <div key={e.client_id}
                className={e.completed === false ? "bar center column" : "bar center column completed"} >
                <Client
                  client={e}
                  index={i}
                  actionList={e.actions}
                  goToMap={this.goToMap}
                  openPayments={this.openPayments}
                  openClientModal={this.openClientModal}
                  optDeleteModal={this.optDeleteModal}
                  openClientSettingsModal={this.openClientSettingsModal} />

                {/* <Actions
                  id={e.client_id}
                  sessionId={e.session_id}
                  actionsComplete={e.completed}
                  checkValues={true}
                  allChecked={this.allItemsChecked}
                  actionList={e.actions}
                /> */}
              </div>
            )
          })
      }
    }

    if (this.props.noClients) {
      return (
        <div className="no-client-container center">
          <i className="fas fa-campground" />
          <h1>Welcome to Looking Fox!</h1>
          <p>Head on over to tools > templates to get started.</p>
        </div>
      )
    }
    else {
      return (
        null
      )
    }

  }

  openModal = () => {
    this.props.updateClientModal({ clientModalOpen: true })
  }

  render() {
    return (
      <div className="client-dashboard align-center column">

        <FilterBar />

        {this.state.loadingClients ?
          <div className="client-loading center">
            <Loading />
          </div> : null}

        {this.renderClients()}


        {/* ------Modals------ */}

        <ClientModal />

        <ClientSettingsModal {...this.props}
          deleteClient={this.deleteClient}
          optDeleteModal={this.optDeleteModal}
          deleteVerify={this.state.deleteVerify}
          deleteInfo={this.state.deleteInfo} />

        <PaymentModal />

        {/* ------Modals------ */}

      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    ...this.props, ...state
  }
}

export default connect(mapStateToProps, { updateClients, updateClientModal, updateClientSettingsModal, updateProps })(Clients)
