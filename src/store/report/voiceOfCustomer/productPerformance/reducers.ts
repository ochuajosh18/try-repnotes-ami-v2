import {
    SET_PRODUCT_PERFORMANCE_STATE,
    ProductPerformanceState,
    ProductPerformanceAction
} from './types';

const INITIAL_STATE: ProductPerformanceState = {
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
    filterProductFamilies: [],
    filterSelectedProductFamily: '',
    filterSelectedRating: '',
    filterSelectedServiceRanking: '',
    filterCustomers: [],
    filterSelectedCustomer: '',
    filterModels: [],
    filterSelectedModel: '',
    filterSelectedViewType: 'Make-Model',
    loading: false,
    productPerformanceList: [],
    report: [],
    activeTab: 'REPORT'
};

export const productPerformanceReducers = (state = INITIAL_STATE, action: ProductPerformanceAction): ProductPerformanceState => {
    switch (action.type) {
        case SET_PRODUCT_PERFORMANCE_STATE:
            return { ...state, ...action.payload };
        case 'reset_report_state':
            return INITIAL_STATE;
        default:
            return state;
    }
}