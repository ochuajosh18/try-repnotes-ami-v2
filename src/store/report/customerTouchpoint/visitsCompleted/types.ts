import { AnyAction } from 'redux';
import { SalesPersonDetails } from '../../../customerManagement/customer/types';
import { LocationDetails } from '../../../customerManagement/location/types';
import { CompanyDetails } from '../../../listManagement/company/types';
import { CustomerTypeDetails } from '../../../listManagement/customerType/types';
import { IndustryDetails } from '../../../listManagement/industry/types';

/**
 * Types for Customer Touchpoint -Upcoming Calls/Visits For The Week
 */
export type DynamicVisitsCompletedType = string | number | boolean | undefined;
export interface DynamicVisitsCompletedInputInterface<T> {
    [key: string]: T;
}
export interface VisitsCompletedStateInput extends DynamicVisitsCompletedInputInterface<DynamicVisitsCompletedType> {}
export interface VisitsCompletedState {
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
    filterSelectedViewType: string;
    filterStartDate: string;
    filterEndDate: string;
    loading: boolean;
    completedCallsList: Array<CompletedCallsDetails>;
    report: Array<DynamicVisitsCompletedInputInterface<DynamicVisitsCompletedType>>;
    activeTab: string;
}

export interface CompletedCallsDetails {
    date: string;
    completedCalls: number;
    incompleteCalls: number;
}

export const SET_VISITS_COMPLETED_STATE = 'set_visits_completed_state';

export interface SetVisitsCompletedStateAction {
    type: typeof SET_VISITS_COMPLETED_STATE;
    payload: VisitsCompletedStateInput;
}

export type VisitsCompletedAction = SetVisitsCompletedStateAction | AnyAction;