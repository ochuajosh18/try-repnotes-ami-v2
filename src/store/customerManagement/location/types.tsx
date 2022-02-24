import { AnyAction } from 'redux'

export interface FormatData {
    [name: string]: string | number | boolean | object
}

export interface LocationProvinceDetails{
    name: string;
    city: string[];
}

export interface LocationDetails extends FormatData{
    companyId: string;
    area: string;
    isActive: boolean;
    province: Array<LocationProvinceDetails>
}

export interface LocationState {
    locationList: Array<LocationDetails>;
    location?: LocationDetails;
    loading: boolean;
    validation: boolean;
    activeProvince: string;
    activeCity: string;
    activeType: string;
    address: string;
    validationMessage: string;
    selectedCompanyId: string
}

export interface LocationInput {
    [name: string]: string | number | boolean | object | FormatData
}

export interface LocationValidation {
    validation: boolean
}

export interface ActiveProvince {
    activeProvince: string
}

export interface ActiveCity {
    activeCity: string
}

export interface AddressInput {
    address: string
}

export interface ValidationMessageInput {
    validationMessage: string
}

export interface ActiveType {
    activeType: string
}

export interface SetSelectedLocationCompanyFilter {
    selectedCompanyId: string
}

export const SET_LOCATION_STATE = 'set_Location_state'

export interface SetLocationAction {
    type: typeof SET_LOCATION_STATE
    payload: LocationState
}

export type LocationAction = SetLocationAction | AnyAction