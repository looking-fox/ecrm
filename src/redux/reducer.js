const initialState = {
    name: '',
    email: '',
    picture: '',
    sub: '', 
    clientModalOpen: false,
    clientSettingsModal: { open: false, client: {} }
}

const UPDATE_USER = 'UPDATE_USER'
const LOGOUT_USER = 'LOGOUT_USER'
const UPDATE_CURRENT_LIST = 'UPDATE_CURRENT_LIST'
const UPDATE_CLIENT_MODAL = 'UPDATE_CLIENT_MODAL'
const UPDATE_CLIENT_SETTINGS_MODAL = 'UPDATE_CLIENT_SETTINGS_MODAL'

export default function reducer(state=initialState, action){
    switch(action.type){

        case UPDATE_USER: 
            return {...state, ...action.payload}

        case LOGOUT_USER: 
            return {...initialState}

        case UPDATE_CURRENT_LIST: 
            return {...state, ...action.payload}

        case UPDATE_CLIENT_MODAL: 
            return {...state, ...action.payload}
        
        case UPDATE_CLIENT_SETTINGS_MODAL: 
            return {...state, ...aciton.payload}

        default: 
            return state
    }
}

export function updateUser(value){
    return {
        type: UPDATE_USER,
        payload: value
    }
}

export function logoutUser(value){
    return {
        type: LOGOUT_USER
    }
}

export function updateCurrentList(value){
    return {
        type: UPDATE_CURRENT_LIST,
        payload: value
    }
}

export function updateClientModal(value){
    return {
        type: UPDATE_CLIENT_MODAL, 
        payload: value
    }
}

export function updateClientSettingsModal(value){
    return {
        type: UPDATE_CLIENT_SETTINGS_MODAL, 
        payload: value
    }
}