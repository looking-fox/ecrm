import React from 'react'
import './Client.css'

export default function Client(props) {
  return (
    <div className="clientcontainer">

        <div className="client">

            <div className="name item">
            <p>{props.name}</p>
            </div>

            <div className="package item">
            <span className="bubble">{props.sessionName}</span>
            </div>

            <div className="date item">
            <p>{props.sessionDate}</p>
            </div>

            <div className="location item"
            onClick={() => props.goToMap(props.sessionLocation)}>
            <p><i className="far fa-map"/>{props.sessionLocation}</p>
            </div>

            <div className="total item">
            <p>{props.sessionPrice}</p>
            </div>

            <div className="settings">
            <i className="fas fa-ellipsis-h"
            onClick={() => props.openClientSettingsModal(props)}/>
            </div>

        </div>

    </div>
  )
}
