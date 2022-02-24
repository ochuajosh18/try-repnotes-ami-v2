import {
    SET_UNMET_NEEDS_STATE,
    UnmetNeedsAction,
    UnmetNeedsState
} from './types'

const INITIAL_STATE: UnmetNeedsState = {
    unmetNeedsInfo: {},
    loading: false,
    salesPersonDocId: '',
    province: '',
    industryId: '',
    customerTypeId: '',
    modelId: '',
    selectedCompanyId: '',
    report: [],
    activeTab: 'REPORT',
    unmetNeedsStartDate: '',
    unmetNeedsEndDate: ''
}

export function unmetNeedsReducers(state = INITIAL_STATE, action: UnmetNeedsAction): UnmetNeedsState {
    switch(action.type) {
        case SET_UNMET_NEEDS_STATE:
            return { ...state, ...action.payload }
        case 'reset_report_state':
            return INITIAL_STATE;
        default:
            return state
    }
}