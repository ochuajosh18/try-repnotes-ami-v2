import { AnyAction } from 'redux'

export interface FormatData {
    [name: string]: string | number | boolean
}

export interface CompanyDetails extends FormatData{
    companyId: string;
    name: string;
    isActive: boolean
}

export interface CompanyState {
    companyArray: Array<CompanyDetails>;
    company?: CompanyDetails;
    loading: boolean;
    validation: boolean;
}

export interface CompanyInput {
    [name: string]: string | number | boolean | FormatData
}

export interface CompanyValidation {
    validation: boolean
}

export const SET_COMPANY_STATE = 'set_company_state'

export interface SetCompanyAction {
    type: typeof SET_COMPANY_STATE
    payload: CompanyState
}

export type CompanyAction = SetCompanyAction | AnyAction