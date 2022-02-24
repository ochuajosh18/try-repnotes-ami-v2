import {
    PromotionState,
    PromotionAction,
    SET_PROMOTION_STATE
} from './types'

const INITIAL_STATE: PromotionState = {
    promotionList: [],
    selectedCompanyId: '',
    loading: false,
    validation: false
}

export function promotionReducers(state = INITIAL_STATE, action: PromotionAction): PromotionState {
    switch(action.type) {
        case SET_PROMOTION_STATE:
            return { ...state, ...action.payload }
        default:
            return state
    }
}