import {
    ForgotPasswordAction,
    ForgotPasswordInput,
    FORGOT_PASSWORD_INPUT,
    FORGOT_PASSWORD_REQUEST,
    RESET_TIMER,
    START_TIMER
} from './types'

const INITIAL_STATE: ForgotPasswordInput = {
    email: '',
    timer: 60,
    loading: false,
    startTimer: false
}

export function forgotPasswordReducers(state = INITIAL_STATE, action: ForgotPasswordAction): ForgotPasswordInput {
    switch(action.type) {
        case FORGOT_PASSWORD_INPUT:
            return { ...state, ...action.payload }
        case FORGOT_PASSWORD_REQUEST:
            return { ...state, ...action.payload }
        case START_TIMER:
            return { ...state, ...action.payload }
        case RESET_TIMER:
            return { ...state, startTimer: false }
        default:
            return state
    }
}