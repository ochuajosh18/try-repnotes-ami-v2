import {
    ProductQualityAction,
    ProductQualityState,
    SET_PRODUCT_QUALITY_STATE
} from './types'

const INITIAL_STATE: ProductQualityState = {
    productQuality: [],
    loading: false,
    salesPersonDocId: '',
    province: '',
    industryId: '',
    customerTypeId: '',
    customerId: '',
    productFamilyId: '',
    modelId: '',
    rating: 0,
    viewType: 'Product Family',
    selectedCompanyId: '',
    report: [],
    activeTab: 'REPORT'
}

export function productQualityReducers(state = INITIAL_STATE, action: ProductQualityAction): ProductQualityState {
    switch(action.type) {
        case SET_PRODUCT_QUALITY_STATE:
            return { ...state, ...action.payload }
        case 'reset_report_state':
            return INITIAL_STATE;
        default:
            return state
    }
}