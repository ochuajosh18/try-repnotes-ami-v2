import {
    SET_ROLES_STATE,
    RolesAction,
    RolesState
} from './types'

const INITIAL_STATE: RolesState = {
    rolesList: [],
    selectedCompanyId: '',
    roles: {
        companyId: '',
        name: '',
        description: '',
        modules: {},
        id: ''
    },
    loading: false,
    validation: false
}

export function rolesReducers(state = INITIAL_STATE, action: RolesAction): RolesState {
    switch(action.type) {
        case SET_ROLES_STATE:
            return { ...state, ...action.payload }
        default:
            return state
    }
}