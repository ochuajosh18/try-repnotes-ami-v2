import {
    LOGIN_INPUT,
    LoginAction,
    LOGIN_SUCCESS,
    LOGIN_FAILED,
    LOGIN_REQUEST,
    LOGOUT_USER,
    LoginState
} from './types'

const INITIAL_STATE: LoginState = {
    username: '',
    password: '',
    loading: false,
    rememberMe: false
}

const loginReducers = (state = INITIAL_STATE, action: LoginAction): LoginState => {
    switch(action.type) {
        case LOGIN_INPUT:
            return { ...state, ...action.payload }
        case LOGIN_REQUEST:
            return { ...state, ...action.payload }
        case LOGIN_SUCCESS:
            return { ...state, ...action.payload }
        case LOGIN_FAILED:
            return { ...state, ...action.payload }
        case LOGOUT_USER:
            return { ...state, ...action.payload }
        default:
            return state
    }
}

export default loginReducers;