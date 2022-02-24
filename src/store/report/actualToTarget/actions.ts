import {
  SET_ACTUAL_TO_TARGET_STATE,
  ActualToTargetAction,
  ActualToTargetStateInput,
  ActualVsTargetDetails,
} from "./types";
import { AppThunk } from "../..";
import { ALERT_STATE } from "../../alert/types";
import { SystemState } from "../../system/types";
import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL;

export const setActualToTargetState = (state: ActualToTargetStateInput): ActualToTargetAction => ({
  type: SET_ACTUAL_TO_TARGET_STATE,
  payload: state,
});

export const resetFilter =
  (state: Array<string>): AppThunk =>
  (dispatch) => {
    state.forEach((filter) => {
      dispatch({
        type: SET_ACTUAL_TO_TARGET_STATE,
        payload: { [filter]: "" },
      });
    });
  };

/**
 * @description fetches the actual vs target data for the report
 * @returns the redux action that was called using Redux Thunk
 */
export const getActualToTargetStatus =
  (system: SystemState, companyId?: string): AppThunk =>
  async (dispatch, getState) => {
    const { token, userDetails } = system.session;
    dispatch({
      type: SET_ACTUAL_TO_TARGET_STATE,
      payload: { loading: true },
    });
    try {
      const { filterSelectedCompany, filterSelectedSalesperson, filterSelectedProvince } =
        getState().actualToTargetState; // uncomment this to get filter data using destructuring
      const salespersonFilter =
        (userDetails.role as string).toLowerCase() === "sales engineer"
          ? `${userDetails.id}`
          : filterSelectedSalesperson;
      const reportRes = await axios.get(
        `${API_URL}report/actual-vs-target/status?companyId=${
          companyId ? companyId : filterSelectedCompany
        }${!salespersonFilter ? "" : `&salesman=${salespersonFilter}`}${
          !filterSelectedProvince ? "" : `&area=${filterSelectedProvince}`
        }`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (reportRes.status === 200 || reportRes.status === 204) {
        dispatch({
          type: SET_ACTUAL_TO_TARGET_STATE,
          payload: {
            actualVsTargetStatus: {
              yearToDate: reportRes.data.YTD,
              quarterToDate: reportRes.data.QTD,
            },
          },
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
        type: SET_ACTUAL_TO_TARGET_STATE,
        payload: { loading: false },
      });
    }
  };

export const getActualToTargetReport =
  (system: SystemState, companyId?: string): AppThunk =>
  async (dispatch, getState) => {
    const { token, userDetails } = system.session;
    dispatch({
      type: SET_ACTUAL_TO_TARGET_STATE,
      payload: { reportLoading: true, actualVsTargetReport: [] },
    });
    try {
      const {
        filterSelectedCompany,
        filterSelectedSalesperson,
        filterSelectedProvince,
        filterSelectedStartQuarter,
        filterSelectedEndQuarter,
        filterSelectedGraphType,
      } = getState().actualToTargetState; // uncomment this to get filter data using destructuring
      const salespersonFilter =
        (userDetails.role as string).toLowerCase() === "sales engineer"
          ? `${userDetails.id}`
          : filterSelectedSalesperson;
      console.log(
        `${API_URL}report/actual-vs-target/report?companyId=${
          companyId ? companyId : filterSelectedCompany
        }${!salespersonFilter ? "" : `&salesman=${salespersonFilter}`}${
          !filterSelectedProvince ? "" : `&area=${filterSelectedProvince}`
        }${!filterSelectedStartQuarter ? "" : `&startQuarter=${filterSelectedStartQuarter}`}${
          !filterSelectedEndQuarter ? "" : `&endQuarter=${filterSelectedEndQuarter}`
        }&viewType=${filterSelectedGraphType}`
      );
      const reportRes = await axios.get(
        `${API_URL}report/actual-vs-target/report?companyId=${
          companyId ? companyId : filterSelectedCompany
        }${!salespersonFilter ? "" : `&salesman=${salespersonFilter}`}${
          !filterSelectedProvince ? "" : `&area=${filterSelectedProvince}`
        }${!filterSelectedStartQuarter ? "" : `&startQuarter=${filterSelectedStartQuarter}`}${
          !filterSelectedEndQuarter ? "" : `&endQuarter=${filterSelectedEndQuarter}`
        }&viewType=${filterSelectedGraphType}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (reportRes.status === 200 || reportRes.status === 204) {
        dispatch({
          type: SET_ACTUAL_TO_TARGET_STATE,
          payload: {
            actualVsTargetReport: {
              reportDetails: reportRes.data.salesReport,
              gapData: reportRes.data.gap,
            },
          },
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
        type: SET_ACTUAL_TO_TARGET_STATE,
        payload: { reportLoading: false },
      });
    }
  };

export const getProvinceList =
  (companyId?: string): AppThunk =>
  async (dispatch, getState) => {
    dispatch({
      type: SET_ACTUAL_TO_TARGET_STATE,
      payload: { loading: true, productPerformanceList: [] },
    });
    try {
      const { filterSelectedCompany } = getState().actualToTargetState; // uncomment this to get filter data using destructuring
      const reportRes = await axios.get(
        `${API_URL}report/actual-vs-target/filter/area?companyId=${
          companyId ? companyId : filterSelectedCompany
        }`
      );
      if (reportRes.status === 200 || reportRes.status === 204) {
        dispatch({
          type: SET_ACTUAL_TO_TARGET_STATE,
          payload: { filterProvinces: reportRes.data },
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
        type: SET_ACTUAL_TO_TARGET_STATE,
        payload: { loading: false },
      });
    }
  };

export const clearImportDialog = (): AppThunk => async (dispatch) => {
  dispatch({
    type: SET_ACTUAL_TO_TARGET_STATE,
    payload: { dialogOpen: false, actualVsTargetList: [] },
  });
};

export const importActualToTargetData =
  (system: SystemState, file: File | any): AppThunk =>
  async (dispatch, getState) => {
    const { token } = system.session;
    const { filterSelectedCompany } = getState().actualToTargetState; // uncomment this to get filter data using destructuring
    if (filterSelectedCompany !== "") {
      dispatch({
        type: SET_ACTUAL_TO_TARGET_STATE,
        payload: { loading: true, actualVsTargetList: [] },
      });
      try {
        let formData = new FormData();
        formData.append("uploads[]", file[0], file[0].name);
        const payloadResult = await axios.post(
          `${API_URL}media/excel/upload/actualVsTarget?companyId=${filterSelectedCompany}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // to use, data is returned as payloadResult
        if (payloadResult.status === 200 || payloadResult.status === 204) {
          dispatch({
            type: SET_ACTUAL_TO_TARGET_STATE,
            payload: {
              actualVsTargetList: [
                ...(payloadResult.data as Array<ActualVsTargetDetails>).filter(
                  (item) => item.month !== "" && item
                ),
              ],
            },
          });
          if (payloadResult.data.length > 0) {
            dispatch({
              type: SET_ACTUAL_TO_TARGET_STATE,
              payload: { dialogOpen: true },
            });
          }
        }
      } catch (err) {
        let msg = "";
        err.response.status === 409
          ? (msg = err.response.data.message)
          : (msg = err.response.data.error.message);
        dispatch({
          type: ALERT_STATE,
          payload: { alertOpen: true, alertMessage: msg.split(":").pop(), alertType: "error" },
        });
      } finally {
        dispatch({
          type: SET_ACTUAL_TO_TARGET_STATE,
          payload: { loading: false },
        });
      }
    } else {
      dispatch({
        type: ALERT_STATE,
        payload: { alertOpen: true, alertMessage: "Please Select a company", alertType: "warning" },
      });
    }
  };

export const saveImportData =
  (system: SystemState): AppThunk =>
  async (dispatch, getState) => {
    dispatch({
      type: SET_ACTUAL_TO_TARGET_STATE,
      payload: { uploadLoading: true },
    });
    try {
      const { actualVsTargetList } = getState().actualToTargetState; // uncomment this to get filter data using destructuring
      const payloadResult = await axios.post(
        `${API_URL}report/actual-vs-target`,
        actualVsTargetList
      );
      if (payloadResult.status === 200 || payloadResult.status === 204) {
        const hasInvalid = payloadResult.data.count !== actualVsTargetList.length;
        const alertMessage = hasInvalid
          ? "Invalid Salesperson"
          : `Uploading Done! ${payloadResult.data.count} of ${actualVsTargetList.length} uploaded.`;
        dispatch({
          type: ALERT_STATE,
          payload: { alertOpen: true, alertMessage, alertType: hasInvalid ? "error" : "success" },
        });
      }
    } catch (err) {
    } finally {
      dispatch({
        type: SET_ACTUAL_TO_TARGET_STATE,
        payload: { uploadLoading: false, dialogOpen: false },
      });
    }
  };

export const exportActualToTarget =
  (system: SystemState): AppThunk =>
  async (dispatch, getState) => {
    const { token } = system.session;
    dispatch({
      type: SET_ACTUAL_TO_TARGET_STATE,
      payload: { loading: true },
    });
    try {
      const { filterSelectedCompany, filterSelectedSalesperson, filterSelectedProvince } =
        getState().actualToTargetState; // uncomment this to get filter data using destructuring
      const reportRes = await axios.get(
        `${API_URL}report/actual-vs-target/export?companyId=${filterSelectedCompany}${
          !filterSelectedSalesperson ? "" : `&salesman=${filterSelectedSalesperson}`
        }${!filterSelectedProvince ? "" : `&area=${filterSelectedProvince}`}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        }
      );
      if (reportRes.status === 200 || reportRes.status === 204) {
        const url = window.URL.createObjectURL(new Blob([reportRes.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "actual-vs-target.xlsx");
        document.body.appendChild(link);
        link.click();
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
        type: SET_ACTUAL_TO_TARGET_STATE,
        payload: { loading: false },
      });
    }
  };
