import {
    SET_QUOTES_BY_STATUS_STATE,
    QuotesByStatusState,
    QuotesByStatusAction
} from './types';

const INITIAL_STATE: QuotesByStatusState = {
    filterCompanies: [],
    filterSelectedCompany: '',
    filterSalespersons: [],
    filterSelectedSalesperson: '',
    filterProvinces: [],
    filterSelectedProvince: '',
    filterIndustries: [],
    filterSelectedIndustry: '',
    filterCustomerTypes: [],
    filterSelectedCustomerType: '',
    loading: false,
    filterSelectedViewType: 'Count',
    summaryCloseLost: 0,
    summaryWithdraw: 0,
    summaryOpenQuotes: 0,
    summaryCloseWon: 0,
    report: [],
    activeTab: 'REPORT'
};

export const quotesByStatusReducers = (state = INITIAL_STATE, action: QuotesByStatusAction): QuotesByStatusState => {
    switch (action.type) {
        case SET_QUOTES_BY_STATUS_STATE:
            return { ...state, ...action.payload };
        case 'reset_report_state':
            return INITIAL_STATE;
        default:
            return state;
    }
}