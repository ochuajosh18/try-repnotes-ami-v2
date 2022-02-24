import { AnyAction } from 'redux';
export type DynamicCustomerExperienceType = string | number | boolean | undefined;
export interface DynamicCustomerExperienceInputInterface<T> {
    [key: string]: T;
}

export interface CustomerExperienceDetails{
    purchasingExperience: number;
    communicationOfOrderStatus: number;
    productLeadTime: number;
    deliveryExperience: number;
    partsAvailability: number;
    partsPricing: number;
    serviceTechnicianSupport: number;
    others: number;
}

export interface CustomerExperienceState {
    customerExperienceInfo: CustomerExperienceDetails;
    loading: boolean;
    salesPersonDocId: string;
    province: string;
    industryId: string;
    customerTypeId: string;
    customerId: string;
    rating: number;
    yearDate: string;
    selectedCompanyId: string;
    report: Array<DynamicCustomerExperienceInputInterface<DynamicCustomerExperienceType>>;
    activeTab: string;
}

export const SET_CUSTOMER_EXPERIENCE_STATE = 'set_customer_experience_state';

export interface SetCustomerExperienceAction {
    type: typeof SET_CUSTOMER_EXPERIENCE_STATE
    payload: CustomerExperienceState
}

export type CustomerExperienceAction = SetCustomerExperienceAction | AnyAction