import { AnyAction } from 'redux';
import { CompanyDetails } from '../../listManagement/company/types';
/**
 * Types for Actual vs Target Report
 */
export type DynamicActualToTargetType = string | number | boolean | undefined | Array<ActualVsTargetReport | ActualVsTargetStatus>; 
export interface DynamicActualToTargetInputInterface<T> {
    [key: string]: T;
}
export interface ActualToTargetStateInput extends DynamicActualToTargetInputInterface<DynamicActualToTargetType> {}
export interface ActualToTargetState {
    actualToTargetTab: string;
    loading: boolean;
    filterCompanies: Array<CompanyDetails>; // list of companies
    filterSelectedCompany: string; // selected company for filter
    filterSalespersons: Array<SalesPersonDetails>; // list of salespersons for filters
    filterSelectedSalesperson: string; // selected salesperson for filter
    filterSelectedGraphType: string; // selected graph type for filter
    filterSelectedStartQuarter: string; // selected graph type for filter
    filterSelectedEndQuarter: string; // selected graph type for filter
    filterProvinces: Array<ProvinceDetails>; // list of province for filter
    filterSelectedProvince: string; // selected province for filter
    actualVsTargetStatus?: ActualVsTargetStatus;
    actualVsTargetReport: ActualVsTargetReport;
    actualVsTargetList: Array<ActualVsTargetDetails>;
    dialogOpen: boolean;
    uploadLoading: boolean;
    reportLoading: boolean;
    statusLoading: boolean;
}

export interface ActualVsTargetDetails {
    month: string;
    target: string | number;
    salesman: string;
    area: string;
    actual: string | number;
    backlog: string | number;
}

export interface ActualVsTargetReport {
    reportDetails: Array<FullYearDetails>;
    gapData: Array<number>;
}

export interface ActualVsTargetStatus {
    quarterToDate: QuarterDetails;
    yearToDate: YearToDateDetails;
}

export interface RowData {
    [property : string] : string | number ;
}

export interface SalesPersonDetails extends RowData{
    salesPerson: string;
}

export interface ProvinceDetails extends RowData{
    area: string;
}

export interface YearToDateDetails{
    summaryWholeYearTarget: number;
    summaryActualSalesToDate: number;
    summaryBacklogToDate: number;
}

export interface QuarterDetails{
    summaryWholeYearTarget: QuarterData;
    summaryActualSalesToDate: QuarterData;
    summaryBacklogToDate: QuarterData;
}

export interface QuarterData{
    q1: number;
    q2: number;
    q3: number;
    q4: number;
}

export interface FullYearDetails{
    name: string;
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
    ytd: number;
    fy: number;
    qtd: number;
}

export const SET_ACTUAL_TO_TARGET_STATE = 'set_actual_to_target_state';

export interface SetActualToTargetStateAction {
    type: typeof SET_ACTUAL_TO_TARGET_STATE;
    payload: ActualToTargetStateInput;
}

export type ActualToTargetAction = SetActualToTargetStateAction | AnyAction;