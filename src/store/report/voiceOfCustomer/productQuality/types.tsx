import { AnyAction } from 'redux'

export type DynamicProductQualityType = string | number | boolean | undefined;
export interface DynamicProductQualityInputInterface<T> {
    [key: string]: T;
}

export interface ProductQualityDetails {
    name: string;
    newCount: number;
}

export interface ProductQualityState {
    productQuality: Array<ProductQualityDetails>;
    loading: boolean;
    salesPersonDocId: string;
    province: string;
    industryId: string;
    customerTypeId: string;
    customerId: string;
    productFamilyId: string;
    modelId: string;
    viewType: string;
    rating: number;
    selectedCompanyId: string;
    report: Array<DynamicProductQualityInputInterface<DynamicProductQualityType>>;
    activeTab: string;
}

export const SET_PRODUCT_QUALITY_STATE = 'set_product_quality_state';

export interface SetProductQualityAction {
    type: typeof SET_PRODUCT_QUALITY_STATE
    payload: ProductQualityState
}

export type ProductQualityAction = SetProductQualityAction | AnyAction;