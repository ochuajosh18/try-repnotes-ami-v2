import { 
    SET_CUSTOMER_TYPE_STATE,
    CustomerTypeAction,
    CustomerTypeState
} from './types'

const INITIAL_STATE: CustomerTypeState = {
    customerTypeList : [],
    loading: false,
    selectedCompanyId: '',
    validation: false
}

export function customerTypeReducers(state = INITIAL_STATE, action: CustomerTypeAction): CustomerTypeState {
    switch(action.type) {
        case SET_CUSTOMER_TYPE_STATE:
            return { ...state, ...action.payload }
        case 'reset_list_management_state':
            return INITIAL_STATE;
        default:
            return state
    }
}




