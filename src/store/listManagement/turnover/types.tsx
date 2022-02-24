import { AnyAction } from 'redux'

export interface FormatData {
    [name: string]: string | number | boolean
}

export interface TurnoverDetails extends FormatData{
    companyId: string;
    name: string;
    isActive: boolean;
    id: string;
}

export interface TurnoverState {
    turnoverList: Array<TurnoverDetails>;
    turnover?: TurnoverDetails;
    loading: boolean;
    validation: boolean;
    selectedCompanyId: string;
}

export interface TurnoverInput {
    [name: string]: string | number | boolean | FormatData
}

export interface TurnoverValidation {
    validation: boolean
}

export interface SetTOSelectedCompanyFilter {
    selectedCompanyId: string
}

export const SET_TURNOVER_STATE = 'set_turnover_state'

export interface SetTurnoverAction {
    type: typeof SET_TURNOVER_STATE
    payload: TurnoverState
}

export type TurnoverAction = SetTurnoverAction | AnyAction