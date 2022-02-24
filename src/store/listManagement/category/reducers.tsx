import { 
    CategoryAction, 
    CategoryState, 
    SET_CATEGORY_STATE
} from './types'

const INITIAL_STATE: CategoryState = {
    categoryList: [],
    loading: false,
    selectedCompanyId: '',
    validation: false
}

export function categoryReducers(state = INITIAL_STATE, action: CategoryAction): CategoryState {
    switch(action.type) {
        case SET_CATEGORY_STATE:
            return { ...state, ...action.payload }
        case 'reset_list_management_state':
            return INITIAL_STATE;
        default:
            return state
    }
}