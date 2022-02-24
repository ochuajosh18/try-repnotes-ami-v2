import { AnyAction } from "redux";

export interface FormatData {
  [name: string]: string | number | boolean | Media | Array<Media>;
}

export interface Media {
  name: string;
  path: string;
  size: string | number;
  type: string;
  file?: File;
}

export interface CustomerDetails extends FormatData {
  companyId: string;
  name: string;
  isActive: boolean;
  customerTypeId: string;
  industryId: string;
  internationalLocalId: string;
  fleetSize: string;
  branch: string;
  streetAddress: string;
  area: string;
  province: string;
  cityTown: string;
  category: string;
  groupName: string;
  salesPersonDocId: string;
  governmentPrivateId: string;
  tierId: string;
  turnOverId: string;
  contactNo1: string;
  contactNo2: string;
  email: string;
  internalTag: string;
  additionalNotes: string;
  status: string;
  id: string;
}

export interface SalesPersonDetails {
  name: string;
  id: string;
  isActive: boolean;
}

export interface CustomerState {
  customerList: Array<CustomerDetails>;
  salesPersonList: Array<SalesPersonDetails>;
  customer?: CustomerDetails;
  loading: boolean;
  validation: boolean;
  searchData: string;
  approval: boolean;
  locationList: Array<CustomerDetails>;
  selectedCompanyId: string;
  importLoading: boolean;
  importCustomerList: Array<CustomerDetails>;
  dialogOpen: boolean;
  summaryDialog: boolean;
}

export interface CustomerInput {
  [name: string]:
    | string
    | number
    | boolean
    | FormatData
    | Array<CustomerDetails>;
}

export interface CustomerValidation {
  validation: boolean;
}

export interface CustomerApproval {
  approval: boolean;
}

export interface CustomerSeachInput {
  searchData: string;
}

export interface SetSelectedCompanyFilter {
  selectedCompanyId: string;
}

export const SET_CUSTOMER_STATE = "set_customer_state";

export interface SetCustomerAction {
  type: typeof SET_CUSTOMER_STATE;
  payload: CustomerState;
}

export type CustomerAction = SetCustomerAction | AnyAction;
