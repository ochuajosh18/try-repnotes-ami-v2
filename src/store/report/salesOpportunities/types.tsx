import { AnyAction } from 'redux'

export type DynamicSalesOpportunitiesType = string | number | boolean | undefined;

export interface DynamicSalesOpportunitiesInputInterface<T> {
    [key: string]: T;
}
export interface SalesOpportunitiesStateInput extends DynamicSalesOpportunitiesInputInterface<DynamicSalesOpportunitiesType> {}

export interface SalesOpportunitiesDetails {
    report: Array<ReportDetails>;
    status: StatusDetails;
}

export interface StatusDetails{
    yearToDate: StatusYearToDateDetails;
    monthly: StatusMonthlyDetails;
}

export interface RowData {
    [property : string] : string | number ;
}

export interface ReportDetails extends RowData{
    customerContact: string;
    customerName: string;
    dateCreated: string;
    SalesOpportunityNo: string;
    model: string;
    price: number;
    quantity: number;
    totalAmount: number;
}

export interface StatusYearToDateDetails{
    lostDealTodate: number;
    openSales: number;
}

export interface StatusMonthlyDetails{
    lostDealTodate: MonthLyDetails;
    openSales: MonthLyDetails;
}

export interface MonthLyDetails{
    april: number;
    august: number;
    december: number;
    february: number;
    january: number;
    july: number;
    june: number;
    march: number;
    may: number;
    november: number;
    october: number;
    september: number;
}

export interface SalesOpportunitiesState {
    salesOpportunities: SalesOpportunitiesDetails;
    loading: boolean;
    datePeriod: string;
    salesPersonDocId: string;
    customerDocId: string;
    makeDocId: string;
    startDate: string;
    endDate: string;
    province: string;
    industryId: string;
    customerTypeId: string;
    productFamilyId: string;
    modelId: string;
    viewType: string;
    onSelectDateRange: boolean;
    selectedCompanyId: string;
    activeTab: string;
}

export const SET_SALES_OPPORTUNITIES_STATE = 'set_sales_oppportunities_state';

export interface SetSalesOpportunitiesAction {
    type: typeof SET_SALES_OPPORTUNITIES_STATE
    payload: SalesOpportunitiesStateInput
}

export type SalesOpportunitiesAction = SetSalesOpportunitiesAction | AnyAction