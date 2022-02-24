import { AnyAction } from 'redux'

export type DynamicMarketReportType = string | number | boolean | RollingDetails | undefined;
export interface DynamicMarketReportInputInterface<T> {
    [key: string]: T;
}

export interface MarketReportStateInput extends DynamicMarketReportInputInterface<DynamicMarketReportType> {}

export interface MarketState {
    marketList: Array<MarketDetails>
    loading: boolean;
    rollingYear: string;
    marketSize: number;
    unitSales: number;
    productFamilyId:string;
    rollingMarketSize: RollingDetails;
    rollingUnitSales: RollingDetails;
    rollingShare: RollingDetails;
    marketProductFamilyList: Array<ProductFamilyDetails>
    selectedCompanyId: string;
    selectedSalespersonId: string;
    dialogOpen: boolean;
    uploadLoading: boolean;
    report: Array<DynamicMarketReportInputInterface<DynamicMarketReportType>>;
    activeTab: string;
}

export interface MarketDetails {
    period: string;
    productFamily: string;
    marketSize: string | number;
    unitSales: string | number;
}

export interface SetMSSelectedCompanyFilter {
    selectedCompanyId: string
}

export interface RowData {
    [property : string] : string | number ;
}

export interface RollingDetails {
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

export interface ProductFamilyDetails extends RowData{
    productFamily: string;
}

export interface MarketProductFamilyFilter {
    productFamilyId: string;
}

export const SET_MARKET_STATE = 'set_market_state'

export interface SetMarketAction {
    type: typeof SET_MARKET_STATE
    payload: MarketState
}

export interface SetMarketReportStateAction {
    type: typeof SET_MARKET_STATE
    payload: MarketReportStateInput
}

export type MarketAction = SetMarketReportStateAction | SetMarketAction | AnyAction