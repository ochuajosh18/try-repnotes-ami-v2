import moment from 'moment'
import { 
    SalesOpportunitiesAction, 
    SalesOpportunitiesState, 
    SET_SALES_OPPORTUNITIES_STATE
} from './types'

const INITIAL_STATE: SalesOpportunitiesState = {
    salesOpportunities: {
        report: [],
        status: {
            yearToDate: {
                openSales: 0,
                lostDealTodate: 0
            },
            monthly: {
                openSales: {
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
                    december: 0,
                },
                lostDealTodate: {
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
                    december: 0,
                }
            }
        }
    },
    selectedCompanyId: '',
    loading: false,
    datePeriod: 'yeartodate',
    salesPersonDocId: '',
    customerDocId: '',
    makeDocId: '',
    province: '',
    industryId: '',
    customerTypeId: '',
    productFamilyId: '',
    modelId: '',
    viewType: 'Count',
    startDate: moment().startOf('year').format('YYYY-MM-DD'),
    endDate: moment().endOf('year').format('YYYY-MM-DD'),
    onSelectDateRange: false,
    activeTab: 'REPORT'
}

export function salesOpportunitiesReducers(state = INITIAL_STATE, action: SalesOpportunitiesAction): SalesOpportunitiesState {
    switch(action.type) {
        case SET_SALES_OPPORTUNITIES_STATE:
            return { ...state, ...action.payload }
        case 'reset_report_state':
            return INITIAL_STATE;
        default:
            return state
    }
}