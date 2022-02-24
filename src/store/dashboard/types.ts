import { AnyAction } from "redux";
import { CustomerDetails, SalesPersonDetails } from "../customerManagement/customer/types";
import { LocationDetails } from "../customerManagement/location/types";
import { CompanyDetails } from "../listManagement/company/types";
import { ReportDetails } from "../report/salesOpportunities/types";

export type DynamicDashboardType = string | number | boolean | undefined;
export interface DynamicDashboardInputInterface<T> {
  [key: string]: T;
}
export interface DashboardStateInput extends DynamicDashboardInputInterface<DynamicDashboardType> {}

export interface DashboardState {
  filterCompanies: Array<CompanyDetails>; // list of companies
  filterSelectedCompany: string; // selected company for filter
  salesOpportunities: Array<ReportDetails>;
  meetings: Array<DynamicDashboardInputInterface<DynamicDashboardType>>;
  notesLogs: NotesLog[];
  filterSalespersons: Array<SalesPersonDetails>; // list of salespersons for filters
  filterSelectedSalesperson: string; // selected salesperson for filter
  filterProvinces: Array<LocationDetails>; // list of province for filter
  filterSelectedProvince: string; // selected province for filter
  filterCustomers: Array<CustomerDetails>; // list of customer for filters
  filterSelectedCustomer: string; // selected customer for filters
  customerCount: number;
  userCount: number;
  salespersonCount: number;
  loading: boolean;
  salesDateRange: FilterDateRange;
  meetingsDateRange: FilterDateRange;
  notesDateRange: FilterDateRange;
}

export type FilterDateRange = "current" | "past-30-days" | "next-7-days";

export type DateRangeType = {
  id: FilterDateRange;
  name: string;
};

export const SET_DASHBOARD_STATE = "set_dashboard_state";

export const SET_DASHBOARD_DATE_RANGE = "set_dashboard_date_range";

export interface SetDashboardStateAction {
  type: typeof SET_DASHBOARD_STATE;
  payload: DashboardStateInput;
}

export interface SetDashboardDateRangeAction {
  type: typeof SET_DASHBOARD_DATE_RANGE;
  payload: {
    key: keyof DashboardState;
    value: FilterDateRange;
  };
}

// these are used in Notes Activity Log Table
export interface CustomerExperience {
  title: string;
  comment: string;
  rating: number;
}

export interface NotesLog {
  area: string;
  branch: string;
  companyId: string;
  customerEmail: string;
  customerId: string;
  customerName: string;
  customerNoteId: string;
  customerPhoneOne: string;
  customerPhoneTwo: string;
  dateCreated: string;
  id: string;
  noteType: string;
  province: string;
  salesPerson: string;
  salesPersonDocId: string;
  customerExperience?: CustomerExperience[];
  make?: string;
  modelName?: string;
  serviceRanking?: number;
}

export interface SalesOppLog {
  area: string;
  branch: string;
  companyId: string;
  customerEmail: string;
  customerId: string;
  customerName: string;
  customerPhoneOne: string;
  customerPhoneTwo: string;
  dateCreated: string;
  id: string;
  isForQuotation: boolean;
  isForSalesOpporunity: boolean;
  model: string;
  price: number;
  province: string;
  quantity: number;
  salesPerson: string;
  salesPersonDocId: string;
  soName?: string;
  status: string;
  totalAmount: number;
}

export interface MeetingLog {
  area: string;
  branch: string;
  cancelReason?: string;
  companyId: string;
  customerEmail: string;
  customerId: string;
  customerName: string;
  customerPhoneOne: string;
  customerPhoneTwo: string;
  dateCreated: string;
  id: string;
  isCancelled?: boolean;
  meetingDate: string;
  planEndTime?: string;
  planStartTime?: string;
  province: string;
  purpose: string;
  salesPerson: string;
  salesPersonDocId: string;
  startDate: string;
  startTime: string;
}

export type DashboardAction = SetDashboardStateAction | SetDashboardDateRangeAction | AnyAction;
