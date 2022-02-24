import { AnyAction } from 'redux'

export type DynamicUnmetNeedsType = string | number | boolean;
export interface DynamicUnmetNeedsInputInterface<T> {
    [key: string]: T;
}

export interface UnmetNeedsState {
    unmetNeedsInfo: DynamicUnmetNeedsInputInterface<DynamicUnmetNeedsType>;
    loading: boolean;
    salesPersonDocId: string;
    province: string;
    industryId: string;
    customerTypeId: string;
    modelId: string;
    selectedCompanyId: string;
    report: Array<DynamicUnmetNeedsInputInterface<DynamicUnmetNeedsType>>;
    activeTab: string;
    unmetNeedsStartDate: string;
    unmetNeedsEndDate: string;
}

export interface SetUNSelectedCompanyFilter {
    selectedCompanyId: string
}

export interface UnmetNeedsSalesPersonDocIdFilter {
    salesPersonDocId: string;
}

export interface UnmetNeedsProvinceFilter {
    province: string;
}

export interface UnmetNeedsIndustryFilter {
    industryId: string;
}

export interface UnmetNeedsCustomerTypeFilter {
    customerTypeId: string;
}

export interface UnmetNeedsModelFilter {
    modelId: string;
}

export const SET_UNMET_NEEDS_STATE = 'set_unmet_needs_state'

export interface SetUnmetNeedsAction {
    type: typeof SET_UNMET_NEEDS_STATE
    payload: UnmetNeedsState
}

export type UnmetNeedsAction = SetUnmetNeedsAction | AnyAction