import { AnyAction } from 'redux';
export type DynamicMarginReportType = string | number | boolean | undefined;
export interface DynamicMarginReportInputInterface<T> {
    [key: string]: T;
}

export interface MarginStateInput extends DynamicMarginReportInputInterface<DynamicMarginReportType> {}

export interface MarginState {
    marginList: Array<MarginDetails>
    loading: boolean;
    rollingYear: string;
    invoiceAmount: number;
    cost: number;
    customerTypeId: string;
    provinceId: string;
    modelId: string;
    productFamilyId:string;
    marginResult: MarginResultDetails;
    marginProductFamilyList: Array<ProductFamilyDetails>;
    marginModelList: Array<ModelDetails>;
    marginCustomerTypeList: Array<CustomerTypeDetails>;
    marginCustomerList: Array<CustomerDetails>;
    marginProvinceList: Array<ProvinceDetails>;
    selectedCompanyId: string;
    selectedSalespersonId: string;
    selectedMakeId: string;
    selectedCustomerId: string;
    dialogOpen: boolean;
    uploadLoading: boolean;
    activeTab: string;
    report: Array<DynamicMarginReportInputInterface<DynamicMarginReportType>>;
    marginStartDate: string;
    marginEndDate: string;
}

export interface MarginDetails {
    date: string;
    country: string;
    customer: string;
    customerType: string;
    province: string;
    model: string;
    productFamily: string;
    invoiceNo: string;
    invoiceQty: string | number;
    invoiceAmount: string | number;
    cost: string | number;
    margin: string | number;
}

export interface RowData {
    [property : string] : string | number ;
}

export interface CustomerTypeDetails extends RowData{
    customerType: string;
}

export interface CustomerDetails extends RowData{
    customer: string;
}

export interface ProvinceDetails extends RowData{
    province: string;
}

export interface ModelDetails extends RowData{
    model: string;
}

export interface ProductFamilyDetails extends RowData{
    productFamily: string;
}

export interface MarginResultDetails {
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

export const SET_MARGIN_STATE = 'set_margin_state';

export interface SetMarginAction {
    type: typeof SET_MARGIN_STATE
    payload: MarginState
}

export interface SetMarginStateAction {
    type: typeof SET_MARGIN_STATE
    payload: MarginStateInput
}

export type MarginAction = SetMarginStateAction | SetMarginAction | AnyAction