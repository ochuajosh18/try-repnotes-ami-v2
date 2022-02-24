import { 
    MarketAction, 
    MarketState, 
    SET_MARKET_STATE
} from './types'

const INITIAL_STATE: MarketState = {
    marketList: [],
    loading: false,
    rollingYear: '',
    marketSize: 0,
    unitSales: 0,
    productFamilyId: '',
    selectedCompanyId: '',
    marketProductFamilyList: [],
    rollingMarketSize: {
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
    rollingShare: {
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
    rollingUnitSales: {
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
    selectedSalespersonId: '',
    dialogOpen: false,
    uploadLoading: false,
    report: [],
    activeTab: 'REPORT'
}

export function marketReducers(state = INITIAL_STATE, action: MarketAction): MarketState {
    switch(action.type) {
        case SET_MARKET_STATE:
            return { ...state, ...action.payload }
        case 'reset_report_state':
            return INITIAL_STATE;
        default:
            return state
    }
}