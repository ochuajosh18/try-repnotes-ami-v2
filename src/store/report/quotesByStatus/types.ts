import { AnyAction } from 'redux';
import { SalesPersonDetails } from '../../customerManagement/customer/types';
import { LocationDetails } from '../../customerManagement/location/types';
import { CompanyDetails } from '../../listManagement/company/types';
import { CustomerTypeDetails } from '../../listManagement/customerType/types';
import { IndustryDetails } from '../../listManagement/industry/types';
/**
 * Types for Actual vs Target Report
 */
export type DynamicQuotesByStatusType = string | number | boolean | undefined;
export interface DynamicQuotesByStatusInputInterface<T> {
    [key: string]: T;
}
export interface QuotesByStatusStateInput extends DynamicQuotesByStatusInputInterface<DynamicQuotesByStatusType> {}
export interface QuotesByStatusState {
    loading: boolean;
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
    summaryCloseLost: string | number; // value of summary per status - close lost
    summaryWithdraw: string | number; // value of summary per status - withdraw
    summaryOpenQuotes: string | number; // value of summary per status - open quotes
    summaryCloseWon: string | number; // value of summary per status - close won
    report: Array<DynamicQuotesByStatusInputInterface<DynamicQuotesByStatusType>>;
    activeTab: string;
}

export const SET_QUOTES_BY_STATUS_STATE = 'set_quotes_by_status_state';

export interface SetQuotesByStatusStateAction {
    type: typeof SET_QUOTES_BY_STATUS_STATE;
    payload: QuotesByStatusStateInput;
}

export type QuotesByStatusAction = SetQuotesByStatusStateAction | AnyAction;