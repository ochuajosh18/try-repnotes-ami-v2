import { AnyAction } from 'redux'

export interface FormatData {
    [name: string]: string | number | boolean
}

export interface MakeDetails extends FormatData{
    companyId: string;
    name: string;
    isActive: boolean;
    id: string;
}

export interface MakeState {
    makeList: Array<MakeDetails>;
    make?: MakeDetails;
    loading: boolean;
    validation: boolean;
    selectedCompanyId: string;
}

export interface MakeInput {
    [name: string]: string | number | boolean | FormatData
}

export interface MakeValidation {
    validation: boolean
}

export interface SetMakeSelectedCompanyFilter {
    selectedCompanyId: string
}

export const SET_MAKE_STATE = 'set_make_state'

export interface SetMakeAction {
    type: typeof SET_MAKE_STATE
    payload: MakeState
}

export type MakeAction = SetMakeAction | AnyAction