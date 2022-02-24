import { AnyAction } from 'redux'



export interface TypeOfEntriesDetails{
    Monthly: MonthlyDetails;
    YearToDate: YearToDateDetails;
}

export interface YearToDateDetails{
    competitionInfo: number;
    customerExperience: number;
    generalComments: number;
    productPerformance: number;
    productQuality: number;
    unmetNeed: number;
}

export interface MonthlyDetails{
    competitionInfo: MonthlyData;
    customerExperience: MonthlyData;
    generalComments: MonthlyData;
    productPerformance: MonthlyData;
    productQuality: MonthlyData;
    unmetNeed: MonthlyData;
}

export interface MonthlyData{
    january: number;
    february: number;
    march: number;
    april: number;
    may: number;
    june: number;
    july: number;
    august: number;
    september: number;
    october: number;
    november: number;
    december: number;
}


export interface TypeOfEntriesState {
    typeOfEntriesInfo: TypeOfEntriesDetails;
    loading: boolean;
    salesPersonDocId: string;
    province: string;
    industryId: string;
    customerTypeId: string;
    datePeriod: string;
    selectedCompanyId: string;
}

export interface SetTESelectedCompanyFilter {
    selectedCompanyId: string
}

export interface TypeOfEntriesSalesPersonDocIdFilter {
    salesPersonDocId: string;
}

export interface TypeOfEntriesProvinceFilter {
    province: string;
}

export interface TypeOfEntriesIndustryFilter {
    industryId: string;
}

export interface TypeOfEntriesCustomerTypeFilter {
    customerTypeId: string;
}

export interface TypeOfEntriesDatePeriodFilter {
    datePeriod: string;
}

export const SET_TYPE_OF_ENTRIES_STATE = 'set_typ_of_entries_state'

export interface SetTypeOfEntriesAction {
    type: typeof SET_TYPE_OF_ENTRIES_STATE
    payload: TypeOfEntriesState
}

export type TypeOfEntriesAction = SetTypeOfEntriesAction | AnyAction