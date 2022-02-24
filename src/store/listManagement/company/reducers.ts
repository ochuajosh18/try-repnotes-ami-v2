import {
    CompanyAction,
    SET_COMPANY_STATE,
    CompanyState
} from './types'

const INITIAL_STATE: CompanyState = {
    companyArray: [],
    loading: false,
    validation: false

}

export const companyReducers = (state = INITIAL_STATE, action: CompanyAction): CompanyState => {
    switch(action.type) {
        case SET_COMPANY_STATE:
            return { ...state, ...action.payload }
        case 'reset_list_management_state':
            return INITIAL_STATE;
        default:
            return state
    }
}