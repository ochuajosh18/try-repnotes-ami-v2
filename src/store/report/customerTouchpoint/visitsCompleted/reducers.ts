import {
    SET_VISITS_COMPLETED_STATE,
    VisitsCompletedState,
    VisitsCompletedAction
} from './types';
import moment from 'moment';

const INITIAL_STATE: VisitsCompletedState = {
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
    filterSelectedViewType: 'Weekly',
    filterStartDate: moment().startOf('week').format('YYYY-MM-DD'),
    filterEndDate: moment().endOf('week').format('YYYY-MM-DD'),
    loading: false,
    completedCallsList: [],
    report: [],
    activeTab: 'REPORT'
};

export const visitsCompletedReducers = (state = INITIAL_STATE, action: VisitsCompletedAction): VisitsCompletedState => {
    switch (action.type) {
        case SET_VISITS_COMPLETED_STATE:
            return { ...state, ...action.payload };
        case 'reset_report_state':
            return INITIAL_STATE;
        default:
            return state;
    }
}