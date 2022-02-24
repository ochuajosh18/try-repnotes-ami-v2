import { AnyAction } from 'redux'

export interface FormatData {
    [name: string]: string | number | boolean
}

export interface CustomerTypeDetails extends FormatData{
    companyId: string;
    name: string;
    isActive: boolean;
    id: string;
}

export interface CustomerTypeState {
    customerTypeList: Array<CustomerTypeDetails>;
    customerType?: CustomerTypeDetails;
    loading: boolean;
    validation: boolean;
    selectedCompanyId: string;
}

export interface CustomerTypeInput {
    [name: string]: string | number | boolean | FormatData
}

export interface CustomerTypeValidation {
    validation: boolean
}

export interface SetSelectedCompanyFilter {
    selectedCompanyId: string
}

export const SET_CUSTOMER_TYPE_STATE = 'set_customer_Type_state'

export interface SetCustomerTypeAction {
    type: typeof SET_CUSTOMER_TYPE_STATE
    payload: CustomerTypeState
}

export type CustomerTypeAction = SetCustomerTypeAction | AnyAction