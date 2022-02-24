import { 
    SET_GOVERNMENT_PRIVATE_STATE,
    GovernmentPrivateAction,
    GovernmentPrivateState
} from './types'

const INITIAL_STATE: GovernmentPrivateState = {
    governmentPrivateList : [],
    selectedCompanyId: '',
    loading: false,
    validation: false
}

export function governmentPrivateReducers(state = INITIAL_STATE, action: GovernmentPrivateAction): GovernmentPrivateState {
    switch(action.type) {
        case SET_GOVERNMENT_PRIVATE_STATE:
            return { ...state, ...action.payload }
        case 'reset_list_management_state':
            return INITIAL_STATE;
        default:
            return state
    }
}




