import { AnyAction } from 'redux'

export interface FormatData {
    [name: string]: string | number | boolean
}

export interface IndustryDetails extends FormatData{
    companyId: string;
    name: string;
    isActive: boolean;
    id: string;
}

export interface IndustryState {
    industryList: Array<IndustryDetails>;
    industry?: IndustryDetails;
    loading: boolean;
    validation: boolean;
    selectedCompanyId: string;
}

export interface IndustryInput {
    [name: string]: string | number | boolean | FormatData
}

export interface IndustryValidation {
    validation: boolean
}

export interface SetSelectedIndustryCompanyFilter {
    selectedCompanyId: string
}

export const SET_INDUSTRY_STATE = 'set_industry_state'

export interface SetIndustryAction {
    type: typeof SET_INDUSTRY_STATE
    payload: IndustryState
}

export type IndustryAction = SetIndustryAction | AnyAction