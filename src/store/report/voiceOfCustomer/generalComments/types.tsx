import { AnyAction } from 'redux';

export type DynamicGeneralCommentsType = string | number | boolean | undefined;
export interface DynamicGeneralCommentsInputInterface<T> {
    [key: string]: T;
}

export interface GeneralCommentsDetails{
    projectPipeline: number;
    customerBusiness: number;
    macroBusinessClimate: number;
}

export interface GeneralCommentsState {
    generalComments: GeneralCommentsDetails;
    loading: boolean;
    salesPersonDocId: string;
    province: string;
    industryId: string;
    customerTypeId: string;
    customerId: string;
    selectedCompanyId: string;
    report: Array<DynamicGeneralCommentsInputInterface<DynamicGeneralCommentsType>>;
    activeTab: string;
}

export const SET_GENERAL_COMMENTS_STATE = 'set_general_comments_state'

export interface SetGeneralCommentsAction {
    type: typeof SET_GENERAL_COMMENTS_STATE
    payload: GeneralCommentsState
}

export type GeneralCommentsAction = SetGeneralCommentsAction | AnyAction