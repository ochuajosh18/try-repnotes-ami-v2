import { 
    SET_INTERNATIONAL_LOCAL_STATE,
    InternationalLocalAction,
    InternationalLocalState
} from './types'

const INITIAL_STATE: InternationalLocalState = {
    internationalLocalList : [],
    selectedCompanyId: '',
    loading: false,
    validation: false
}

export function internationalLocalReducers(state = INITIAL_STATE, action: InternationalLocalAction): InternationalLocalState {
    switch(action.type) {
        case SET_INTERNATIONAL_LOCAL_STATE:
            return { ...state, ...action.payload }
        case 'reset_list_management_state':
            return INITIAL_STATE;
        default:
            return state
    }
}




