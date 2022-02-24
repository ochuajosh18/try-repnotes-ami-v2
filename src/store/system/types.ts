import { AnyAction } from "redux";
export type ListItem =
  | "Salesperson"
  | "Product"
  | "Customer"
  | "Customer Type"
  | "Location"
  | "Industry"
  | "Category"
  | "Product Family"
  | "Make"
  | "Turnover"
  | "Tier"
  | "Internation/Local"
  | "Government/Private";

export type SystemStateType = string | boolean;

export interface SystemStateInput<T> {
  [key: string]: T;
}

export interface UserDetails {
  [property: string]: string | number | boolean;
  email: string;
  firstName: string;
  lastName: string;
  middleName: string;
  dateCreated: string;
  companyId: string;
  id: string;
}

export interface Permissions {
  add: boolean | string;
  edit: boolean | string;
  delete: boolean | string;
  view: boolean | string;
}

export interface Modules {
  brochure: Permissions;
  customer: Permissions;
  product: Permissions;
  listManagement: Permissions;
  location: Permissions;
  rolesAndPermission: Permissions;
  salesOpportunities: Permissions;
  marginReport: Permissions;
  marketShare: Permissions;
  actualVsTarget: Permissions;
  quotesByStatus: Permissions;
  voiceOfCustomer: Permissions;
  customerTouchpoint: Permissions;
  promotion: Permissions;
  user: Permissions;
  fields: Permissions;
}

export interface Session {
  token: string;
  refreshToken: string;
  userDetails: UserDetails;
  modules: Modules;
  isLoggedIn: boolean;
}

export interface ActivePage {
  activeTab: string;
  subActive: string;
  secondSubActive: string;
}

export interface RedirectPage {
  shallRedirect: boolean;
  redirectTo: string;
}

export interface SystemState {
  session: Session;
  drawerTab: ActivePage;
  drawerCollapse: boolean;
  redirectPage: RedirectPage;
  interceptors: { requestId: number; responseId: number } | null;
  rememberUser: boolean;
}

export const SET_SYSTEM_STATE = "set_system_state";
export const SET_SESSION = "set_session";
export const DISPLAY_ACTIVE = "display_active";
export const TOGGLE_DRAWER_COLLAPSE = "toggle_drawer_collapse";
export const SET_REDIRECT = "set_redirect";
export const SET_INTERCEPTOR = "set_interceptor";
export const EJECT_INTERCEPTOR = "eject_interceptor";

export interface SetSystemStateAction {
  type: typeof SET_SYSTEM_STATE;
  payload: SystemStateInput<SystemStateType>;
}

export interface SetSessionAction {
  type: typeof SET_SESSION;
  payload: Session;
}

export interface SetRedirectAction {
  type: typeof SET_REDIRECT;
  payload: RedirectPage;
}

export interface SetActiveSystemAction {
  type: typeof DISPLAY_ACTIVE;
  payload: ActivePage;
}

export interface SetToggleDrawerCollapseAction {
  type: typeof TOGGLE_DRAWER_COLLAPSE;
  payload: boolean;
}

export type SystemAction =
  | SetSessionAction
  | SetToggleDrawerCollapseAction
  | SetActiveSystemAction
  | SetRedirectAction
  | AnyAction;
