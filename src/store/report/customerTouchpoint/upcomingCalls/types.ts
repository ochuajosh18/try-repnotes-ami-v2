import { SalesPersonDetails } from '../../../customerManagement/customer/types';
import { ProvinceDetails } from '../../marginReport/types';
import { CompanyDetails } from '../../../listManagement/company/types';
import { CustomerTypeDetails } from '../../../listManagement/customerType/types';
import { IndustryDetails } from '../../../listManagement/industry/types';
import { AnyAction } from 'redux';

/**
 * Types for Customer Touchpoint -Upcoming Calls/Visits For The Week
 */
export type DynamicUpcomingCallsType = string | number | boolean | undefined;
export interface DynamicUpcomingCallsInputInterface<T> {
    [key: string]: T;
}
export interface UpcomingCallsStateInput extends DynamicUpcomingCallsInputInterface<DynamicUpcomingCallsType> {}
export interface UpcomingCallsState {
    filterCompanies: Array<CompanyDetails>; // list of companies
    filterSelectedCompany: string; // selected company for filter
    filterSalespersons: Array<SalesPersonDetails>; // list of salespersons for filters
    filterSelectedSalesperson: string; // selected salesperson for filter
    filterProvinces: Array<ProvinceDetails>; // list of province for filter
    filterSelectedProvince: string; // selected province for filter
    filterIndustries: Array<IndustryDetails> // list of industries for filters
    filterSelectedIndustry: string; // selected industry for filters
    filterCustomerTypes: Array<CustomerTypeDetails>; // list of customer types for filters
    filterSelectedCustomerType: string; // selected customer type for filters
    filterSelectedViewType: string;
    filterStartDate: string;
    filterEndDate: string;
    loading: boolean;
    upcomingList: Array<UpcomingDetails>;
    report: Array<DynamicUpcomingCallsInputInterface<DynamicUpcomingCallsType>>;
    activeTab: string;
}

export interface UpcomingDetails {
    date: string;
    newCount: number;
}

export const SET_UPCOMING_CALLS_STATE = 'set_upcoming_calls_state';

export interface SetUpcomingCallsStateAction {
    type: typeof SET_UPCOMING_CALLS_STATE;
    payload: UpcomingCallsStateInput;
}

export type UpcomingCallsAction = SetUpcomingCallsStateAction | AnyAction;