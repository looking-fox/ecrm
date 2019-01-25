import React, { Component } from "react";
import "./Sidebar.css";
import Tutorial from "../Clients/Tutorial/Tutorial";
import SubscriptionModal from "./SubscriptionModal/SubscriptionModal";
import VerifyDeleteList from './VerifyDeleteList/VerifyDeleteList';
import SidebarFooter from './SidebarFooter/SidebarFooter'
import Lists from "./Lists";
import axios from "axios";
import Fade from "react-reveal/Fade";
import { connect } from "react-redux";
import {
  updateUser,
  logoutUser,
  updateCurrentList,
  updateClientModal,
  updateProps
} from "../../redux/reducer";
import Modal from "react-responsive-modal";
import { DragDropContext } from "react-beautiful-dnd";

//TODO: Move Delete List Check into Separate Component

class Sidebar extends Component {
  constructor() {
    super();
    this.state = {
      open: false,
      lists: [],
      listName: "",
      deleteListCheck: false,
      listInEdit: {},
      listToMove: null,
      showTutorial: false,
      userMenu: false,
      optionsMenu: false,
      subscriptionModal: false
    };

    //If options menu is open, but user clicks away--close menu.
    window.addEventListener("click", event => {
      const { id } = event.target;
      if (id !== "menu-icon" && this.state.optionsMenu) {
        this.setState({ optionsMenu: false });
      }
      if (id !== "user-menu" && this.state.userMenu) {
        this.setState({ userMenu: false });
      }
    });
  }

  componentDidMount() {
    axios
      .get("/api/user-info")
      .then(res => {
        const { pathname } = this.props.history.location;
        const { lists, termsofservice } = res.data;

        if (!termsofservice) this.props.history.push("/signup");

        this.setState({ lists });
        this.props.updateUser(res.data);

        if (lists[0]) {
          if (lists[0].list_id) {
            let id = lists[0].list_id;
            this.props.updateCurrentList({ listId: id });
          }
        }
        if (pathname === "/dashboard/welcome") {
          this.setState({ showTutorial: true });
        }
      })
      .catch(error => {
        //If 500 error with no user, redirect to home page.
        this.props.history.push("/");
      });
  }

  onDragEnd = result => {
    const { destination, source, draggableId } = result;

    //If dropped outside droppable or same index just return
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    //Else splice and move to new position & update props
    let movingItem = this.state.lists[draggableId];
    let previousItem = this.state.lists[destination.index];

    var newList = this.state.lists.slice();
    newList.splice(source.index, 1);
    newList.splice(destination.index, 0, movingItem);

    let swap = {
      dragId: movingItem.list_id,
      hoverId: previousItem.list_id,
      dragIndex: source.index,
      hoverIndex: destination.index
    };

    axios
      .post("/api/changelistorder", { swap })
      .then(() => this.setState({ lists: newList }));
  };

  //Hit enter key on input box to save list.
  returnSave = event => {
    if (event.keyCode === 13) this.saveList();
  };

  saveList = () => {
    const { listName } = this.state;

    if (this.state.listInEdit.list_name) {
      const { index, list_id } = this.state.listInEdit;
      axios.put("/api/updatelist", { list_id, listName }).then(() => {
        let newList = this.state.lists;
        let updatedListItem = this.state.lists[index];

        updatedListItem["list_name"] = listName;
        newList.splice(index, 1, updatedListItem);

        this.setState({
          open: false,
          lists: newList,
          listInEdit: {},
          listName: ""
        });
        this.props.updateProps({ lists: newList, listId: -1 });
        this.props.updateProps({ listId: list_id });
      });
    } else {
      axios.post("/api/addlist", { listName }).then(response => {
        let newList = response.data[0];
        let updatedList = this.state.lists;
        updatedList.push(newList);
        this.props.updateProps({ lists: updatedList });
        this.setState({ open: false, lists: updatedList });
      });
    }
  };

  updateCurrentList = id => {
    this.props.updateCurrentList({ listId: id });
  };

  listTransfer = list => {
    this.setState({ listToMove: parseInt(list.target.value) })
  }

  clearDeleteListState = () => {
    this.setState({
      deleteListCheck: false,
      listName: "",
      listInEdit: {}
    })
  }

  toggleTutorial = () => {
    this.setState({ showTutorial: !this.state.showTutorial })
  }

  openClient = () => {
    axios.get("/api/getsessiontypes").then(response => {
      //If user has no session types, they can't add a client.
      //If user has no lists, they can't add clients.
      if (response.data[0]) {
        if (response.data[0].session_id !== null) {
          if (this.props.lists[0]) {
            this.setState({
              sessionTypes: response.data,
              sessionPrice: response.data[0].session_price
            });

            this.props.updateClientModal({
              clientModalOpen: true
            });
          }
        }
      } else {
        alert(
          "You'll first want to click on your user icon and go to Tools > Templates and add a few session types."
        );
      }
    });
  };

  clickList = list => {
    this.updateCurrentList(list.list_id);

    if (this.props.match.path !== "/dashboard") {
      this.props.history.push("/dashboard");
    }
  };

  optionsMenu = () => {
    this.setState({ optionsMenu: !this.state.optionsMenu });
  };

  deleteListCheck = (list, index) => {
    //Add index to list var that we verify user wants to delete.
    //Set default listId to move clients to that isn't current list.

    let listWithIndex = { ...list, ...{ index } };
    let defaultListId =
      this.state.lists.length > 1
        ? this.state.lists.filter(e => {
          return e.list_id !== list.list_id;
        })[0].list_id
        : this.state.lists[0].list_id;

    this.setState({
      listInEdit: listWithIndex,
      deleteListCheck: true,
      listToMove: defaultListId
    });
  };

  updateList = (list, index) => {
    const { list_name } = list;
    let listWithIndex = { ...list, ...{ index } };
    this.setState({
      open: true,
      listName: list_name,
      listInEdit: listWithIndex
    });
  };

  deleteList = () => {
    const { index, list_id } = this.state.listInEdit;

    axios.delete(`/api/deletelist/${list_id}`)
      .then(() => {
        let newList = this.state.lists;
        newList.splice(index, 1);

        this.props.updateProps({ listId: -1, lists: newList });
        this.setState({
          deleteListCheck: false,
          lists: newList,
          listInEdit: {},
          listName: ""
        });
      });
  };

  moveClients = () => {
    let deleteId = this.state.listInEdit.list_id;
    let moveId = this.state.listToMove;
    axios
      .put("/api/moveclients", { deleteId, moveId })
      .then(() => this.deleteList());
  };

  showAllClients = () => {
    this.updateCurrentList(-1);

    if (this.props.match.path !== "/dashboard") {
      this.props.history.push("/dashboard");
    }
  };

  //Todo: Combine these functions (openSub && showUserMenu)
  showUserMenu = () => {
    this.setState(prevState => {
      return { userMenu: !prevState.userMenu };
    });
  };

  toggleSubscription = () => {
    this.setState(prevState => {
      return { subscriptionModal: !prevState.subscriptionModal };
    });
  };

  logOut = () => {
    axios.post("/api/logout").then(() => {
      this.props.logoutUser();
      this.props.history.push("/");
    });
  };

  hideTutorial = () => {
    this.setState({ showTutorial: false });
  };

  render() {
    const { deleteListCheck, listInEdit, lists } = this.state;
    const isUserMenuOpen = this.state.userMenu ? "flex" : "none";

    return (
      <Fade>
        <div className="sidebar">
          <div className="topbar">
            <img
              className="profileimage"
              id="user-menu"
              src={this.props.picture}
              alt="user profile"
              onClick={() => this.showUserMenu()}
            />

            <div
              className="options-menu user-menu"
              style={{ display: isUserMenuOpen }}
            >
              <p onClick={() => this.props.history.push("/tools/templates")}>
                <i className="fas fa-wrench" />
                tools
              </p>

              <p onClick={this.toggleSubscription}>
                <i className="fas fa-credit-card" />
                subscription
              </p>

              <p onClick={this.logOut}>
                <i className="fas fa-sign-in-alt" />
                logout
              </p>
            </div>

            {/* Normally I'd use Link. But props is not updating location. Currently reviewing MJacksons notes on blocked location props.  */}
          </div>

          <div className="menu-item center" onClick={this.showAllClients}>
            <p>
              <i className="fas fa-users" />
              Clients
            </p>
            <i
              onClick={() => this.setState({ open: true })}
              className="fas fa-plus-circle add-icon menu-icon"
            />
          </div>

          <DragDropContext onDragEnd={this.onDragEnd}>
            <Lists
              lists={this.state.lists}
              listId={this.props.listId}
              optionsMenu={this.optionsMenu}
              optionsMenuOpen={this.state.optionsMenu}
              clickList={this.clickList}
              openClient={this.openClient}
              updateList={this.updateList}
              deleteListCheck={this.deleteListCheck}
            />
          </DragDropContext>

          <SidebarFooter
            toggleTutorial={this.toggleTutorial} />

          {/* Modal to Add List or Edit Previous List */}
          <Modal
            open={this.state.open}
            onClose={() =>
              this.setState({ open: false, listName: "", listInEdit: {} })
            }
            center
          >
            {this.state.listInEdit.list_name ? (
              <h3 className="modal-title">Update List</h3>
            ) : (
                <h3 className="modal-title">
                  <i className="fas fa-users" /> Add Client List
              </h3>
              )}

            <input
              className="input-box"
              autoFocus
              placeholder="Client List Name"
              value={this.state.listName}
              onChange={e => this.setState({ listName: e.target.value })}
              onKeyDown={e => this.returnSave(e)}
            />

            <div className="list-modal">
              <button
                type="button"
                className="btn btn-primary save full"
                onClick={this.saveList}
              >
                {this.state.listInEdit.list_name ? "Save List" : "+ Add List"}
              </button>
            </div>
          </Modal>

          <VerifyDeleteList
            //--Var--//
            deleteListCheck={deleteListCheck}
            listInEdit={listInEdit}
            lists={lists}
            //--Func--//
            clearAndClose={this.clearDeleteListState}
            listTransfer={this.listTransfer}
            moveClients={this.moveClients}
            deleteList={this.deleteList} />

          <Tutorial
            showTutorial={this.state.showTutorial}
            hideTutorial={this.hideTutorial}
          />

          <SubscriptionModal
            {...this.props}
            open={this.state.subscriptionModal}
            hide={this.toggleSubscription}
          />
        </div>
      </Fade>
    );
  }
}

function mapStateToProps(state) {
  return {
    ...this.props,
    ...state
  };
}

export default connect(
  mapStateToProps,
  { updateUser, logoutUser, updateCurrentList, updateClientModal, updateProps }
)(Sidebar);