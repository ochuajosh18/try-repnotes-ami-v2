import { 
    TypeOfEntriesAction, 
    TypeOfEntriesState, 
    SET_TYPE_OF_ENTRIES_STATE
} from './types'

const INITIAL_STATE: TypeOfEntriesState = {
    typeOfEntriesInfo: {
        Monthly: {
            competitionInfo: {
                january: 0,
                february: 0,
                march: 0,
                april: 0,
                may: 0,
                june: 0,
                july: 0,
                august: 0,
                september: 0,
                october: 0,
                november: 0,
                december: 0
            },
            customerExperience: {
                january: 0,
                february: 0,
                march: 0,
                april: 0,
                may: 0,
                june: 0,
                july: 0,
                august: 0,
                september: 0,
                october: 0,
                november: 0,
                december: 0
            },
            generalComments: {
                january: 0,
                february: 0,
                march: 0,
                april: 0,
                may: 0,
                june: 0,
                july: 0,
                august: 0,
                september: 0,
                october: 0,
                november: 0,
                december: 0
            },
            productPerformance: {
                january: 0,
                february: 0,
                march: 0,
                april: 0,
                may: 0,
                june: 0,
                july: 0,
                august: 0,
                september: 0,
                october: 0,
                november: 0,
                december: 0
            },
            productQuality: {
                january: 0,
                february: 0,
                march: 0,
                april: 0,
                may: 0,
                june: 0,
                july: 0,
                august: 0,
                september: 0,
                october: 0,
                november: 0,
                december: 0
            },
            unmetNeed: {
                january: 0,
                february: 0,
                march: 0,
                april: 0,
                may: 0,
                june: 0,
                july: 0,
                august: 0,
                september: 0,
                october: 0,
                november: 0,
                december: 0
            },
        },
        YearToDate: {
            competitionInfo: 0,
            customerExperience: 0,
            generalComments: 0,
            productPerformance: 0,
            productQuality: 0,
            unmetNeed: 0,
        }
    },
    loading: false,
    salesPersonDocId: '',
    selectedCompanyId: '',
    province: '',
    industryId: '',
    customerTypeId: '',
    datePeriod: 'YearToDate'
}

export function typeOfEntriesReducers(state = INITIAL_STATE, action: TypeOfEntriesAction): TypeOfEntriesState {
    switch(action.type) {
        case SET_TYPE_OF_ENTRIES_STATE:
            return { ...state, ...action.payload }
        case 'reset_report_state':
            return INITIAL_STATE;
        default:
            return state
    }
}