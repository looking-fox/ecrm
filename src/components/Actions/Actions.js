import React, { Component } from "react";
import "./Actions.css";
import axios from "axios";
import PropTypes from "prop-types";

export default class Actions extends Component {
  constructor() {
    super();
    this.state = {
      actionItems: []
    };
  }

  //If all items are complete, change complete to true in DB.
  allItemsComplete = () => {
    const { actionItems } = this.state;
    let index = actionItems.findIndex(e => !e.check);
    let completed = index === -1 ? true : false;

    if (completed !== this.props.actionsComplete) {
      var clientId = this.props.id;

      this.props.allChecked(clientId, completed);
      axios.put("/api/clientcomplete", { clientId, check: completed });
    }
  };

  //Status variable passed as argument! Heads up.
  actionCheck = (index, check, status = null) => {
    if (this.props.checkValues) {
      if (check === true) status = false;
      else status = true;

      var updatedActions = this.props.actionList.slice();
      updatedActions[index].check = status;
      this.setState({ actionItems: updatedActions }, () => {
        const { sessionId } = this.props;
        const { actionItems } = this.state;
        axios
          .put("/api/updateaction", { sessionId, actionItems })
          .then(() => this.allItemsComplete());
      });
    } else {
      alert("You can't complete something in your settings 🤷‍");
    }
  };

  render() {
    return (
      <div className="list">
        {this.props.actionList.map((e, i) => {
          if (e.check === true && this.props.checkValues === true) {
            return (
              <div
                className="action"
                key={i}
                onClick={() => this.actionCheck(i, e.check)}
              >
                <i className="fas fa-check-circle" />
                <p>{e.name}</p>
              </div>
            );
          } else {
            return (
              <div
                className="action"
                key={i}
                onClick={() => this.actionCheck(i, e.check)}
              >
                <i className="far fa-check-circle" />
                <p>{e.name}</p>
              </div>
            );
          }
        })}
      </div>
    );
  }
}

Actions.propTypes = {
  id: PropTypes.number,
  actionsComplete: PropTypes.bool,
  checkValues: PropTypes.bool.isRequired,
  allChecked: PropTypes.func,
  actionList: PropTypes.array.isRequired
};
