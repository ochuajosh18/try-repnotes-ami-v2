import { 
    ProductFamilyAction,
    ProductFamilyState,
    SET_PRODUCT_FAMILY_STATE
} from './types'

const INITIAL_STATE: ProductFamilyState = {
    productFamilyList : [],
    selectedCompanyId: '',
    loading: false,
    validation: false
}

export function productFamilyReducers(state = INITIAL_STATE, action: ProductFamilyAction): ProductFamilyState {
    switch(action.type) {
        case SET_PRODUCT_FAMILY_STATE:
            return { ...state, ...action.payload }
        case 'reset_list_management_state':
            return INITIAL_STATE;
        default:
            return state
    }
}