import {
    UserAction,
    SET_USER_STATE,
    UserState
} from './types'

const INITIAL_STATE: UserState = {
    userList: [],
    selectedCompanyId: '',
    loading: false,
    validation: false
}

export function userReducers(state = INITIAL_STATE, action: UserAction): UserState {
    switch(action.type) {
        case SET_USER_STATE:
            return { ...state, ...action.payload }
        default:
            return state
    }
}