import React from 'react'
import Modal from "react-responsive-modal";
import PropTypes from 'prop-types';

export default function VerifyDeleteList(props) {
    return (
        <Modal
            open={props.deleteListCheck}
            onClose={props.clearAndClose}
            center
        >
            <h3 className="modal-title">
                {props.lists.length > 1 ? (
                    <p>Keep clients from {props.listInEdit.list_name}?</p>
                ) : (
                        <p>Delete {props.listInEdit.list_name}?</p>
                    )}
            </h3>
            <div>
                {/* select list to transfer */}

                {props.lists.length > 1 ? (
                    <div className="delete-list-modal-check center column">
                        <p> Move Clients to: </p>

                        <select onChange={e => props.listTransfer(e)}>
                            {props.lists
                                .filter(e => {
                                    return e.list_id !== props.listInEdit.list_id;
                                })
                                .map(e => {
                                    return (
                                        <option value={e.list_id} key={e.list_id}>
                                            {e.list_name}
                                        </option>
                                    );
                                })}
                        </select>
                    </div>
                ) : (
                        ""
                    )}

                {/* ^^^ select list to transfer ^^^ */}

                {props.lists.length > 1 ? (
                    <React.Fragment>
                        <button
                            type="button"
                            className="btn btn-danger save full"
                            onClick={props.moveClients}
                        >
                            Yes, Move Clients First
                  </button>

                        <button
                            type="button"
                            className="btn btn-danger save full"
                            onClick={props.deleteList}
                        >
                            No, Delete Everything
                  </button>
                    </React.Fragment>
                ) : (
                        <button
                            type="button"
                            className="btn btn-danger save full"
                            onClick={props.deleteList}
                        >
                            Delete List
                </button>
                    )}
            </div>
        </Modal>
    )
}

VerifyDeleteList.propTypes = {
    deleteListCheck: PropTypes.bool.isRequired,
    listInEdit: PropTypes.object.isRequired,
    lists: PropTypes.array.isRequired,
    clearAndClose: PropTypes.func.isRequired,
    listTransfer: PropTypes.func.isRequired,
    moveClients: PropTypes.func.isRequired,
    deleteList: PropTypes.func.isRequired
}