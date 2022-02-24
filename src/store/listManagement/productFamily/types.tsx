import { AnyAction } from 'redux'

export interface FormatData {
    [name: string]: string | number | boolean
}

export interface ProductFamilyDetails extends FormatData{
    companyId: string;
    name: string;
    isActive: boolean;
    id: string;
}

export interface ProductFamilyState {
    productFamilyList: Array<ProductFamilyDetails>;
    productFamily?: ProductFamilyDetails;
    loading: boolean;
    validation: boolean;
    selectedCompanyId: string;
}

export interface ProductFamilyInput {
    [name: string]: string | number | boolean | FormatData
}

export interface ProductFamilyValidation {
    validation: boolean
}

export interface SetPFSelectedCompanyFilter {
    selectedCompanyId: string
}

export const SET_PRODUCT_FAMILY_STATE = 'set_product_family_state'

export interface SetProductFamilyAction {
    type: typeof SET_PRODUCT_FAMILY_STATE
    payload: ProductFamilyState
}

export type ProductFamilyAction = SetProductFamilyAction | AnyAction