import { 
    SET_CUSTOMER_STATE,
    CustomerAction,
    CustomerState
} from './types'

const INITIAL_STATE: CustomerState = {
    customerList: [],
    salesPersonList: [],
    selectedCompanyId: '',
    locationList: [],
    loading: false,
    validation: false,
    approval: false,
    searchData: '',
    importLoading: false,
    importCustomerList: [],
    dialogOpen: false,
    summaryDialog: false
}

export function customerReducers(state = INITIAL_STATE, action: CustomerAction): CustomerState {
    switch(action.type) {
        case SET_CUSTOMER_STATE:
            return { ...state, ...action.payload }
        default:
            return state
    }
}




