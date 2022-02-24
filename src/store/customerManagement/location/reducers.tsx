import { 
    SET_LOCATION_STATE,
    LocationAction,
    LocationState
} from './types'

const INITIAL_STATE: LocationState = {
    locationList : [],
    loading: false,
    validation: false,
    activeProvince: '',
    activeCity: '',
    activeType: '',
    address: '',
    selectedCompanyId: '',
    validationMessage: ''
}

export function locationReducers(state = INITIAL_STATE, action: LocationAction): LocationState {
    switch(action.type) {
        case SET_LOCATION_STATE:
            return { ...state, ...action.payload }
        case 'reset_location_state':
            return INITIAL_STATE;
        default:
            return state
    }
}




