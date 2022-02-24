import {
  DashboardAction,
  DashboardState,
  DashboardStateInput,
  FilterDateRange,
  SET_DASHBOARD_DATE_RANGE,
  SET_DASHBOARD_STATE,
} from "./types";
import { ALERT_STATE } from "../alert/types";
import { SystemState } from "../system/types";
import axios from "axios";
import { AppState, AppThunk } from "..";
import moment from "moment";
import { executeApiCall } from "../fieldsManagement/utils";
const API_URL = process.env.REACT_APP_API_URL;

export const setDashboardState = (state: DashboardStateInput): DashboardAction => ({
  type: SET_DASHBOARD_STATE,
  payload: state,
});

export const setDashboardDateRange = (
  key: keyof DashboardState,
  value: FilterDateRange | string
): DashboardAction => {
  return {
    type: SET_DASHBOARD_DATE_RANGE,
    payload: { key, value },
  };
};

export const resetFilter =
  (state: Array<string>): AppThunk =>
  (dispatch) => {
    state.forEach((filter) => {
      dispatch({
        type: SET_DASHBOARD_STATE,
        payload: { [filter]: "" },
      });
    });
  };

export const getCustomerCount = (system: SystemState, companyId: string): AppThunk => {
  return async (dispatch) => {
    dispatch({
      type: SET_DASHBOARD_STATE,
      payload: { loading: true, customerCount: 0 },
    });
    try {
      const payloadResult = await axios.get(
        `${API_URL}customer/count?companyId=${
          companyId ? companyId : system.session.userDetails.companyId
        }`
      );
      // to use, data is returned as payloadResult
      if (payloadResult.status === 200 || payloadResult.status === 204) {
        dispatch({
          type: SET_DASHBOARD_STATE,
          payload: { customerCount: parseInt(payloadResult.data.count) },
        });
      }
    } catch (err) {
      if (err.response) {
        let msg = err.response.data.error.message;
        msg = msg.split(":").pop();
        dispatch({
          type: ALERT_STATE,
          payload: { alertOpen: true, alertMessage: msg, alertType: "error" },
        });
      }
    } finally {
      dispatch({
        type: SET_DASHBOARD_STATE,
        payload: { loading: false },
      });
    }
  };
};

export const getUserCount = (system: SystemState, companyId: string, role?: string): AppThunk => {
  return async (dispatch) => {
    dispatch({
      type: SET_DASHBOARD_STATE,
      payload: { loading: true, userCount: 0 },
    });
    try {
      const payloadResult = await axios.get(
        `${API_URL}user/count?companyId=${
          companyId ? companyId : system.session.userDetails.companyId
        }${role ? `&role=${role}` : ""}`
      );
      // to use, data is returned as payloadResult
      if (payloadResult.status === 200 || payloadResult.status === 204) {
        dispatch({
          type: SET_DASHBOARD_STATE,
          payload: { userCount: parseInt(payloadResult.data.count) },
        });
      }
    } catch (err) {
      if (err.response) {
        let msg = err.response.data.error.message;
        msg = msg.split(":").pop();
        dispatch({
          type: ALERT_STATE,
          payload: { alertOpen: true, alertMessage: msg, alertType: "error" },
        });
      }
    } finally {
      dispatch({
        type: SET_DASHBOARD_STATE,
        payload: { loading: false },
      });
    }
  };
};

export const getSalespersonCount = (
  system: SystemState,
  companyId: string,
  role?: string
): AppThunk => {
  return async (dispatch) => {
    dispatch({
      type: SET_DASHBOARD_STATE,
      payload: { loading: true, salespersonCount: 0 },
    });
    try {
      const payloadResult = await axios.get(
        `${API_URL}user/count?companyId=${
          companyId ? companyId : system.session.userDetails.companyId
        }&role=sales engineer`
      );
      // to use, data is returned as payloadResult
      if (payloadResult.status === 200 || payloadResult.status === 204) {
        dispatch({
          type: SET_DASHBOARD_STATE,
          payload: { salespersonCount: parseInt(payloadResult.data.count) },
        });
      }
    } catch (err) {
      if (err.response) {
        let msg = err.response.data.error.message;
        msg = msg.split(":").pop();
        dispatch({
          type: ALERT_STATE,
          payload: { alertOpen: true, alertMessage: msg, alertType: "error" },
        });
      }
    } finally {
      dispatch({
        type: SET_DASHBOARD_STATE,
        payload: { loading: false },
      });
    }
  };
};

export const getSalesOpportunity =
  (system: SystemState): AppThunk =>
  async (dispatch, getState) => {
    const { userDetails } = system.session;
    dispatch({
      type: SET_DASHBOARD_STATE,
      payload: { loading: true, salesOpportunities: [] },
    });
    try {
      const {
        filterSelectedCompany,
        filterSelectedSalesperson,
        filterSelectedProvince,
        filterSelectedCustomer,
        salesDateRange,
      } = getState().dashboardState; // uncomment this to get filter data using destructuring
      const salespersonFilter =
        (userDetails.role as string).toLowerCase() === "sales engineer"
          ? `${userDetails.id}`
          : filterSelectedSalesperson;

      const now = moment();
      const startDate =
        salesDateRange === "current"
          ? now.format("YYYY-MM-DD")
          : now.subtract(30, "days").format("YYYY-MM-DD");
      const endDate = moment().format("YYYY-MM-DD");

      const payloadResult = await axios.get(
        `${API_URL}report/sales-opportunity?companyId=${filterSelectedCompany}${`&startDate=${startDate}`}${`&endDate=${endDate}`}${
          !salespersonFilter ? "" : `&salesPersonDocId=${salespersonFilter}`
        }${!filterSelectedCustomer ? "" : `&customerDocId=${filterSelectedCustomer}`}${
          !filterSelectedProvince ? "" : `&province=${filterSelectedProvince}`
        }`
      );
      if (payloadResult.status === 200 || payloadResult.status === 204) {
        const { report } = payloadResult.data;
        dispatch({
          type: SET_DASHBOARD_STATE,
          payload: { salesOpportunities: report },
        });
      }
    } catch (err) {
      let msg = err.response.data.error.message;
      msg = msg.split(":").pop();
      dispatch({
        type: ALERT_STATE,
        payload: { alertOpen: true, alertMessage: msg, alertType: "error" },
      });
    } finally {
      // on everything that can happen, revert the loading state
      dispatch({
        type: SET_DASHBOARD_STATE,
        payload: { loading: false },
      });
    }
  };

export const getMeeting =
  (system: SystemState): AppThunk =>
  async (dispatch, getState) => {
    const { userDetails } = system.session;
    dispatch({
      type: SET_DASHBOARD_STATE,
      payload: { loading: true, meetings: [] },
    });
    try {
      const {
        filterSelectedCompany,
        filterSelectedSalesperson,
        filterSelectedProvince,
        filterSelectedCustomer,
        meetingsDateRange,
      } = getState().dashboardState; // uncomment this to get filter data using destructuring
      const salespersonFilter =
        (userDetails.role as string).toLowerCase() === "sales engineer"
          ? `${userDetails.id}`
          : filterSelectedSalesperson;

      const now = moment();
      const startDate =
        meetingsDateRange === "next-7-days"
          ? now.format("YYYY-MM-DD")
          : now.subtract(30, "days").format("YYYY-MM-DD");
      // const endDate = moment().format("YYYY-MM-DD");

      const payloadResult = await axios.get(
        `${API_URL}report/customer-touchpoint/meeting?companyId=${filterSelectedCompany}${`&startDate=${startDate}`}${
          !salespersonFilter ? "" : `&salesPersonDocId=${salespersonFilter}`
        }${!filterSelectedCustomer ? "" : `&customerDocId=${filterSelectedCustomer}`}${
          !filterSelectedProvince ? "" : `&province=${filterSelectedProvince}`
        }`
      );
      if (payloadResult.status === 200 || payloadResult.status === 204) {
        const { meetingReport } = payloadResult.data;
        console.log(meetingReport);
        dispatch({
          type: SET_DASHBOARD_STATE,
          payload: { meetings: meetingReport },
        });
      }
    } catch (err: any) {
      let msg = "Error";

      if (err?.response?.data?.error?.message) {
        msg = err.response.data.error.message;
        msg = msg.split(":").pop() as string;
      }
      dispatch({
        type: ALERT_STATE,
        payload: { alertOpen: true, alertMessage: msg, alertType: "error" },
      });
    } finally {
      // on everything that can happen, revert the loading state
      dispatch({
        type: SET_DASHBOARD_STATE,
        payload: { loading: false },
      });
    }
  };

// added by jeff
/**
 *
 * @param companyId The company ID
 * @param role The optional role
 * @description Gets the number of Salesperson, Customer, Users of a certain company.
 */
export const getDashboardCounts = (companyId: string, role?: string): AppThunk => {
  return async (dispatch, getState) => {
    dispatch({
      type: SET_DASHBOARD_STATE,
      payload: { loading: true, customerCount: 0 },
    });

    try {
      const system = getState().system;
      const systemCompanyId = system.session.userDetails.companyId;
      const _companyId = companyId ? companyId : systemCompanyId;

      const customerCountURL = `${API_URL}customer/count?companyId=${_companyId}`;
      const salesPersonCountURL = `${API_URL}user/count?companyId=${_companyId}&role=sales engineer`;
      const userCountURL = `${API_URL}user/count?companyId=${_companyId}${
        role ? `&role=${role}` : ""
      }`;

      const customerResult = await axios.get(customerCountURL);
      const salesPersonResult = await axios.get(salesPersonCountURL);
      const userResult = await axios.get(userCountURL);

      if (customerResult.status === 200 || customerResult.status === 204) {
        dispatch({
          type: SET_DASHBOARD_STATE,
          payload: { customerCount: parseInt(customerResult.data.count) },
        });
      }
      if (salesPersonResult.status === 200 || salesPersonResult.status === 204) {
        dispatch({
          type: SET_DASHBOARD_STATE,
          payload: { salespersonCount: parseInt(salesPersonResult.data.count) },
        });
      }
      if (userResult.status === 200 || userResult.status === 204) {
        dispatch({
          type: SET_DASHBOARD_STATE,
          payload: {
            userCount: parseInt(userResult.data.count),
          },
        });
      }
    } catch (err: any) {
      if (err.response) {
        let msg = err.response.data.error.message;
        msg = msg.split(":").pop();
        dispatch({
          type: ALERT_STATE,
          payload: {
            alertOpen: true,
            alertMessage: msg,
            alertType: "error",
          },
        });
      }
    } finally {
      dispatch({
        type: SET_DASHBOARD_STATE,
        payload: { loading: false },
      });
    }
  };
};

/**
 *
 * @description Gets the notes log for dashboard activity log
 */
export const getNotesLogs = (): AppThunk => async (dispatch, getState) => {
  try {
    dispatch({
      type: SET_DASHBOARD_STATE,
      payload: { loading: true },
    });

    const { system, dashboardState } = getState();
    const token = system.session.token;
    const { filterSelectedCompany } = dashboardState;
    const companyId = filterSelectedCompany
      ? filterSelectedCompany
      : system.session.userDetails.companyId;

    const response = await executeApiCall(token).get(`activity-log/notes?companyId=${companyId}`);

    if (response.status === 200) {
      dispatch({
        type: SET_DASHBOARD_STATE,
        payload: {
          notesLogs: response.data,
        },
      });
    }
  } catch (err: any) {
    const message = err.response.data.error.message;
    dispatch({
      type: ALERT_STATE,
      payload: {
        alertOpen: true,
        alertMessage: message,
        alertType: "error",
      },
    });
  } finally {
    dispatch({
      type: SET_DASHBOARD_STATE,
      payload: { loading: false },
    });
  }
};

/**
 *
 * @description Gets the sales opp/quotes log for dashboard activity log
 */
export const getSalesOppsAndQuotesLogs = (): AppThunk => async (dispatch, getState) => {
  try {
    dispatch({
      type: SET_DASHBOARD_STATE,
      payload: { loading: true },
    });

    const { system, dashboardState } = getState();
    const token = system.session.token;
    const { filterSelectedCompany } = dashboardState;
    const companyId = filterSelectedCompany
      ? filterSelectedCompany
      : system.session.userDetails.companyId;

    const url = `activity-log/sales-opportunity?companyId=${companyId}`;
    const response = await executeApiCall(token).get(url);

    if (response.status === 200) {
      dispatch({
        type: SET_DASHBOARD_STATE,
        payload: {
          salesOpportunities: response.data,
        },
      });
    }
  } catch (err: any) {
    const message = err.response.data.error.message;
    dispatch({
      type: ALERT_STATE,
      payload: {
        alertOpen: true,
        alertMessage: message,
        alertType: "error",
      },
    });
  } finally {
    dispatch({
      type: SET_DASHBOARD_STATE,
      payload: { loading: false },
    });
  }
};

/**
 *
 * @description Gets the meetings log for dashboard activity log
 */
export const getMeetingsLogs = (): AppThunk => async (dispatch, getState) => {
  try {
    dispatch({
      type: SET_DASHBOARD_STATE,
      payload: { loading: true },
    });

    const { system, dashboardState } = getState();
    const token = system.session.token;
    const { filterSelectedCompany } = dashboardState;
    const companyId = filterSelectedCompany
      ? filterSelectedCompany
      : system.session.userDetails.companyId;

    const url = `activity-log/meeting?companyId=${companyId}`;
    const response = await executeApiCall(token).get(url);

    if (response.status === 200) {
      dispatch({
        type: SET_DASHBOARD_STATE,
        payload: {
          meetings: response.data,
        },
      });
    }
  } catch (err: any) {
    const message = err.response.data.error.message;
    dispatch({
      type: ALERT_STATE,
      payload: {
        alertOpen: true,
        alertMessage: message,
        alertType: "error",
      },
    });
  } finally {
    dispatch({
      type: SET_DASHBOARD_STATE,
      payload: { loading: false },
    });
  }
};

// SELECTORS
export const selectDashboardState = (state: AppState) => state.dashboardState;
export const selectDashboardDateRange = (key: keyof DashboardState) => (state: AppState) => {
  return state.dashboardState[key];
};
