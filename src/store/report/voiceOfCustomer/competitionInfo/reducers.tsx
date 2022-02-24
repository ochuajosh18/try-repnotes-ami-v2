import { 
    CompetitionAction, 
    CompetitionState, 
    SET_COMPETITION_STATE
} from './types'

const INITIAL_STATE: CompetitionState = {
    competitionInfo: {
        activities: 0,
        commercialTerms: 0,
        pricing: 0
    },
    loading: false,
    salesPersonDocId: '',
    province: '',
    industryId: '',
    selectedCompanyId: '',
    customerTypeId: '',
    customerId: '',
    report: [],
    activeTab: 'REPORT'
}

export function competitionInfoReducers(state = INITIAL_STATE, action: CompetitionAction): CompetitionState {
    switch(action.type) {
        case SET_COMPETITION_STATE:
            return { ...state, ...action.payload }
        case 'reset_report_state':
            return INITIAL_STATE;
        default:
            return state
    }
}