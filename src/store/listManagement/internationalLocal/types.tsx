import { AnyAction } from 'redux'

export interface FormatData {
    [name: string]: string | number | boolean
}

export interface InternationalLocalDetails extends FormatData{
    companyId: string;
    name: string;
    isActive: boolean;
    id: string;
}

export interface InternationalLocalState {
    internationalLocalList: Array<InternationalLocalDetails>;
    internationalLocal?: InternationalLocalDetails;
    loading: boolean;
    validation: boolean;
    selectedCompanyId: string;
}

export interface InternationalLocalInput {
    [name: string]: string | number | boolean | FormatData
}

export interface InternationalLocalValidation {
    validation: boolean;
}

export interface SetILSelectedCompanyFilter {
    selectedCompanyId: string;
}

export const SET_INTERNATIONAL_LOCAL_STATE = 'set_international_local_state'

export interface SetInternationalLocalAction {
    type: typeof SET_INTERNATIONAL_LOCAL_STATE
    payload: InternationalLocalState
}

export type InternationalLocalAction = SetInternationalLocalAction | AnyAction