import {
    BrochureState,
    BrochureAction,
    SET_BROCHURE_STATE
} from './types'

const INITIAL_STATE: BrochureState = {
    brochureList: [],
    selectedCompanyId: '',
    loading: false,
    validation: false
}

export function brochureReducers(state = INITIAL_STATE, action: BrochureAction): BrochureState {
    switch(action.type) {
        case SET_BROCHURE_STATE:
            return { ...state, ...action.payload }
        default:
            return state
    }
}