import { 
    SET_MAKE_STATE,
    MakeAction,
    MakeState
} from './types'

const INITIAL_STATE: MakeState = {
    makeList : [],
    selectedCompanyId: '',
    loading: false,
    validation: false
}

export function makeReducers(state = INITIAL_STATE, action: MakeAction): MakeState {
    switch(action.type) {
        case SET_MAKE_STATE:
            return { ...state, ...action.payload }
        case 'reset_list_management_state':
            return INITIAL_STATE;
        default:
            return state
    }
}




