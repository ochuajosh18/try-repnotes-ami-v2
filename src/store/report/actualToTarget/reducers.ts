import {
    SET_ACTUAL_TO_TARGET_STATE,
    ActualToTargetState,
    ActualToTargetAction
} from './types';

const INITIAL_STATE: ActualToTargetState = {
    actualToTargetTab: 'REPORT',
    filterCompanies: [],
    filterSelectedCompany: '',
    filterSalespersons: [],
    filterSelectedSalesperson: '',
    filterSelectedGraphType: 'YTD',
    filterSelectedStartQuarter: 'Q1',
    filterSelectedEndQuarter: 'Q1',
    filterProvinces: [],
    filterSelectedProvince: '',
    loading: false,
    actualVsTargetStatus: {
        quarterToDate : {
            summaryWholeYearTarget: {
                q1: 0,
                q2: 0,
                q3: 0,
                q4: 0
            },
            summaryActualSalesToDate: {
                q1: 0,
                q2: 0,
                q3: 0,
                q4: 0
            },
            summaryBacklogToDate: {
                q1: 0,
                q2: 0,
                q3: 0,
                q4: 0
            }
        },
        yearToDate: {
            summaryWholeYearTarget: 0,
            summaryActualSalesToDate: 0,
            summaryBacklogToDate: 0
        }
    },
    actualVsTargetList: [],
    actualVsTargetReport: {
        reportDetails: [],
        gapData: []
    },
    dialogOpen: false,
    uploadLoading: false,
    reportLoading: false,
    statusLoading: false
};

export const actualToTargetReducers = (state = INITIAL_STATE, action: ActualToTargetAction): ActualToTargetState => {
    switch (action.type) {
        case SET_ACTUAL_TO_TARGET_STATE:
            return { ...state, ...action.payload };
        case 'reset_report_state':
                return INITIAL_STATE;
        default:
            return state;
    }
}