import { AnyAction } from 'redux'

export interface FormatData {
    [name: string]: string | number | boolean
}

export interface TierDetails extends FormatData{
    companyId: string;
    name: string;
    isActive: boolean;
    id: string;
}

export interface TierState {
    tierList: Array<TierDetails>;
    tier?: TierDetails;
    loading: boolean;
    validation: boolean;
    selectedCompanyId: string;
}

export interface TierInput {
    [name: string]: string | number | boolean | FormatData
}

export interface TierValidation {
    validation: boolean
}

export interface SetTierSelectedCompanyFilter {
    selectedCompanyId: string
}

export const SET_TIER_STATE = 'set_tier_state'

export interface SetTierAction {
    type: typeof SET_TIER_STATE
    payload: TierState
}

export type TierAction = SetTierAction | AnyAction