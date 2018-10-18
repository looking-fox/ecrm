const initialState = {
    name: '',
    email: '',
    picture: '',
    sub: ''
}

const UPDATE_USER = 'UPDATE_USER'
const LOGOUT_USER = 'LOGOUT_USER'

export default function reducer(state=initialState, action){
    switch(action.type){

        case UPDATE_USER: 
            return {...state, ...action.payload}

        case LOGOUT_USER: 
            return {...initialState}

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