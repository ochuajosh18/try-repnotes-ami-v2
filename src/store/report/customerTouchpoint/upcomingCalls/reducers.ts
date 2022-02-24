import {
    SET_UPCOMING_CALLS_STATE,
    UpcomingCallsState,
    UpcomingCallsAction
} from './types';
import moment from 'moment';

const INITIAL_STATE: UpcomingCallsState = {
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
    upcomingList: [],
    report: [],
    activeTab: 'REPORT'
};

export const upcomingCallsReducers = (state = INITIAL_STATE, action: UpcomingCallsAction): UpcomingCallsState => {
    switch (action.type) {
        case SET_UPCOMING_CALLS_STATE:
            return { ...state, ...action.payload };
        case 'reset_report_state':
            return INITIAL_STATE;
        default:
            return state;
    }
}