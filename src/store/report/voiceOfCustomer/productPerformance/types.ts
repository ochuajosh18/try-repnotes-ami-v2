import { AnyAction } from 'redux';
import { CustomerDetails, SalesPersonDetails } from '../../../customerManagement/customer/types';
import { LocationDetails } from '../../../customerManagement/location/types';
import { CompanyDetails } from '../../../listManagement/company/types';
import { CustomerTypeDetails } from '../../../listManagement/customerType/types';
import { IndustryDetails } from '../../../listManagement/industry/types';
import { ProductFamilyDetails } from '../../../listManagement/productFamily/types';
import { ProductDetails } from '../../../productManagement/product/types';

/**
 * Types for Product Performance By Model - Voice of Customer Report
 */
export type DynamicProductPerformanceType = string | number | boolean | undefined;
export interface DynamicProductPerformanceInputInterface<T> {
    [key: string]: T;
}
export interface ProductPerformanceStateInput extends DynamicProductPerformanceInputInterface<DynamicProductPerformanceType> {}
export interface ProductPerformanceState {
    filterCompanies: Array<CompanyDetails>; // list of companies
    filterSelectedCompany: string; // selected company for filter
    filterSalespersons: Array<SalesPersonDetails>; // list of salespersons for filters
    filterSelectedSalesperson: string; // selected salesperson for filter
    filterProvinces: Array<LocationDetails>; // list of province for filter
    filterSelectedProvince: string; // selected province for filter
    filterIndustries: Array<IndustryDetails> // list of industries for filters
    filterSelectedIndustry: string; // selected industry for filters
    filterCustomerTypes: Array<CustomerTypeDetails>; // list of customer types for filters
    filterSelectedCustomerType: string; // selected customer type for filters
    filterCustomers: Array<CustomerDetails>; // list of customer for filters
    filterSelectedCustomer: string; // selected customer for filters
    filterModels: Array<ProductDetails>; // list of model for filters
    filterSelectedModel: string; // selected model for filters
    filterSelectedViewType: string; // selected view type for filters
    filterProductFamilies: Array<ProductFamilyDetails> // list of product families for filters
    filterSelectedProductFamily: string;
    filterSelectedRating: string; // selected rating for filter
    filterSelectedServiceRanking: string; // selected ranking for filter
    loading: boolean;
    productPerformanceList: Array<ProductPerformanceDetails>;
    report: Array<DynamicProductPerformanceInputInterface<DynamicProductPerformanceType>>;
    activeTab: string;
}

export interface ProductPerformanceDetails {
    name: string;
    newCount: number;
}

export const SET_PRODUCT_PERFORMANCE_STATE = 'set_product_performance_state';

export interface SetProductPerformanceStateAction {
    type: typeof SET_PRODUCT_PERFORMANCE_STATE;
    payload: ProductPerformanceStateInput;
}

export type ProductPerformanceAction = SetProductPerformanceStateAction | AnyAction;