import {
    CustomerExperienceState,
    CustomerExperienceAction,
    SET_CUSTOMER_EXPERIENCE_STATE
} from './types'

const INITIAL_STATE: CustomerExperienceState = {
    customerExperienceInfo: {
        purchasingExperience: 0,
        communicationOfOrderStatus: 0,
        productLeadTime: 0,
        deliveryExperience: 0,
        partsAvailability: 0,
        partsPricing: 0,
        serviceTechnicianSupport: 0,
        others: 0
    },
    loading: false,
    salesPersonDocId: '',
    province: '',
    industryId: '',
    customerTypeId: '',
    customerId: '',
    rating: 0,
    yearDate: '',
    selectedCompanyId: '',
    report: [],
    activeTab: 'REPORT'
}

export function customerExperienceReducers(state = INITIAL_STATE, action: CustomerExperienceAction): CustomerExperienceState {
    switch(action.type) {
        case SET_CUSTOMER_EXPERIENCE_STATE:
            return { ...state, ...action.payload }
        case 'reset_report_state':
            return INITIAL_STATE;
        default:
            return state
    }
}