import {
    ALERT_STATE,
    ALERT_CLEAR,
    AlertAction,
    AlertState
} from './types'

const INITIAL_STATE: AlertState = {
    alertOpen: false,
    alertMessage: '',
    alertType: 'info'
}

export function alertReducers(state = INITIAL_STATE, action: AlertAction): AlertState {
    switch(action.type) {
        case ALERT_STATE:
            return { ...action.payload }
        case ALERT_CLEAR:
            return { ...state, alertOpen: false }
        default:
            return state
    }
}