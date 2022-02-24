import { 
    MarginAction, 
    MarginState, 
    SET_MARGIN_STATE
} from './types'

const INITIAL_STATE: MarginState = {
    marginList: [],
    loading: false,
    selectedCompanyId: '',
    customerTypeId: '',
    modelId: '',
    productFamilyId: '',
    provinceId: '',
    marginProductFamilyList: [],
    marginModelList: [],
    marginCustomerTypeList: [],
    marginProvinceList: [],
    marginCustomerList: [],
    rollingYear: '',
    invoiceAmount: 0,
    cost: 0,
    marginResult: {
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
    selectedCustomerId: '',
    selectedMakeId: '',
    dialogOpen: false,
    uploadLoading: false,
    activeTab: 'REPORT',
    report: [],
    marginStartDate: '',
    marginEndDate: ''
}

export function marginReducers(state = INITIAL_STATE, action: MarginAction): MarginState {
    switch(action.type) {
        case SET_MARGIN_STATE:
            return { ...state, ...action.payload }
        case 'reset_report_state':
            return INITIAL_STATE;
        default:
            return state
    }
}