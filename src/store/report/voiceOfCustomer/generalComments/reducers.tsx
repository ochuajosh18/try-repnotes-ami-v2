import { 
    GeneralCommentsAction, 
    GeneralCommentsState, 
    SET_GENERAL_COMMENTS_STATE
} from './types'

const INITIAL_STATE: GeneralCommentsState = {
    generalComments: {
        projectPipeline: 0,
        customerBusiness: 0,
        macroBusinessClimate: 0
    },
    loading: false,
    salesPersonDocId: '',
    province: '',
    industryId: '',
    selectedCompanyId: '',
    customerTypeId: '',
    customerId: '',
    activeTab: 'REPORT',
    report: []
}

export function generalCommentsReducers(state = INITIAL_STATE, action: GeneralCommentsAction): GeneralCommentsState {
    switch(action.type) {
        case SET_GENERAL_COMMENTS_STATE:
            return { ...state, ...action.payload }
        case 'reset_report_state':
            return INITIAL_STATE;
        default:
            return state
    }
}