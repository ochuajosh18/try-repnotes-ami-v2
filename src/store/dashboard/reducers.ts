import {
  DashboardState,
  DashboardAction,
  SET_DASHBOARD_STATE,
  SET_DASHBOARD_DATE_RANGE,
} from "./types";

const INITIAL_STATE: DashboardState = {
  filterCompanies: [],
  filterSelectedCompany: "",
  salesOpportunities: [],
  meetings: [],
  notesLogs: [],
  filterSalespersons: [],
  filterSelectedSalesperson: "",
  filterProvinces: [],
  filterSelectedProvince: "",
  filterCustomers: [],
  filterSelectedCustomer: "",
  customerCount: 0,
  userCount: 0,
  salespersonCount: 0,
  loading: false,
  salesDateRange: "current",
  meetingsDateRange: "current",
  notesDateRange: "current",
};

export function dashboardReducers(
  state = INITIAL_STATE,
  action: DashboardAction
): DashboardState {
  switch (action.type) {
    case SET_DASHBOARD_STATE:
      return { ...state, ...action.payload };
    case SET_DASHBOARD_DATE_RANGE:
      return { ...state, [action.payload.key]: action.payload.value };
    default:
      return state;
  }
}
