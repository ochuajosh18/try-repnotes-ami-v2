import { AnyAction } from 'redux'

export interface FormatData {
    [name: string]: string | number | boolean
}

export interface GovernmentPrivateDetails extends FormatData{
    companyId: string;
    name: string;
    isActive: boolean;
    id: string;
}

export interface GovernmentPrivateState {
    governmentPrivateList: Array<GovernmentPrivateDetails>;
    governmentPrivate?: GovernmentPrivateDetails;
    loading: boolean;
    validation: boolean;
    selectedCompanyId: string;
}

export interface GovernmentPrivateInput {
    [name: string]: string | number | boolean | FormatData
}

export interface GovernmentPrivateValidation {
    validation: boolean
}

export interface SetSelectedGovernmentPrivateCompanyFilter {
    selectedCompanyId: string
}

export const SET_GOVERNMENT_PRIVATE_STATE = 'set_government_private_state'

export interface SetGovernmentPrivateAction {
    type: typeof SET_GOVERNMENT_PRIVATE_STATE
    payload: GovernmentPrivateState
}

export type GovernmentPrivateAction = SetGovernmentPrivateAction | AnyAction