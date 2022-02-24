import { 
    SET_TURNOVER_STATE,
    TurnoverAction,
    TurnoverState
} from './types'

const INITIAL_STATE: TurnoverState = {
    turnoverList : [],
    selectedCompanyId: '',
    loading: false,
    validation: false
}

export function turnoverReducers(state = INITIAL_STATE, action: TurnoverAction): TurnoverState {
    switch(action.type) {
        case SET_TURNOVER_STATE:
            return { ...state, ...action.payload }
        case 'reset_list_management_state':
            return INITIAL_STATE;
        default:
            return state
    }
}