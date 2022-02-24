import { 
    SET_TIER_STATE,
    TierAction,
    TierState
} from './types'

const INITIAL_STATE: TierState = {
    tierList : [],
    selectedCompanyId: '',
    loading: false,
    validation: false
}

export function tierReducers(state = INITIAL_STATE, action: TierAction): TierState {
    switch(action.type) {
        case SET_TIER_STATE:
            return { ...state, ...action.payload }
        case 'reset_list_management_state':
            return INITIAL_STATE;
        default:
            return state
    }
}




