import { 
    IndustryAction,
    IndustryState,
    SET_INDUSTRY_STATE
} from './types'

const INITIAL_STATE: IndustryState = {
    industryList : [],
    selectedCompanyId: '',
    loading: false,
    validation: false
}

export function industryReducers(state = INITIAL_STATE, action: IndustryAction): IndustryState {
    switch(action.type) {
        case SET_INDUSTRY_STATE:
            return { ...state, ...action.payload }
        case 'reset_list_management_state':
            return INITIAL_STATE;
        default:
            return state
    }
}