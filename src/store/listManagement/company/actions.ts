import {
  CompanyAction,
  CompanyDetails,
  CompanyInput,
  CompanyValidation,
  SET_COMPANY_STATE,
} from "./types";
import { ALERT_STATE } from "../../alert/types";
import { SET_REDIRECT } from "../../system/types";
import { DIALOG_STATE } from "../../dialog/types";
import axios from "axios";
import { AppState, AppThunk } from "../..";
const API_URL = process.env.REACT_APP_API_URL;

export const setCompanyState = (company: CompanyInput): CompanyAction => ({
  type: SET_COMPANY_STATE,
  payload: company,
});

export const setCompanyValidationState = (
  data: CompanyValidation
): AppThunk => {
  return async (dispatch) => {
    dispatch({
      type: SET_COMPANY_STATE,
      payload: data,
    });
    dispatch({
      type: ALERT_STATE,
      payload: {
        alertOpen: true,
        alertMessage: "Please Check Required Field",
        alertType: "error",
      },
    });
    dispatch({
      type: DIALOG_STATE,
      payload: {
        dialogOpen: false,
        dialogLabel: "",
        dialogType: "default",
        docId: "",
      },
    });
  };
};

export const getCompany = (token: string): AppThunk => {
  return async (dispatch) => {
    dispatch({
      type: SET_COMPANY_STATE,
      payload: { loading: true, companyArray: [] },
    });
    try {
      const companyRes = await axios.get(`${API_URL}company`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // to use, data is returned as prodRes.data
      if (companyRes.status === 200 || companyRes.status === 204) {
        dispatch({
          type: SET_COMPANY_STATE,
          payload: { companyArray: [...companyRes.data] },
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
        type: SET_COMPANY_STATE,
        payload: { loading: false },
      });
    }
  };
};

export const getSpecificCompany = (id: string, token: string): AppThunk => {
  return async (dispatch) => {
    dispatch({
      type: SET_COMPANY_STATE,
      payload: { loading: true },
    });
    try {
      const companyRes = await axios.get(`${API_URL}company?id=${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // to use, data is returned as prodRes.data
      if (companyRes.status === 200 || companyRes.status === 204) {
        dispatch({
          type: SET_COMPANY_STATE,
          payload: { company: { ...companyRes.data } },
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
        type: SET_COMPANY_STATE,
        payload: { loading: false },
      });
    }
  };
};

export const saveCompany = (
  company: CompanyDetails,
  token: string
): AppThunk => {
  return async (dispatch) => {
    dispatch({
      type: SET_COMPANY_STATE,
      payload: { loading: true },
    });
    try {
      const companyRes = await axios.post(`${API_URL}company`, company, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // to use, data is returned as prodRes.data
      if (companyRes.status === 200 || companyRes.status === 204) {
        dispatch({
          type: ALERT_STATE,
          payload: {
            alertOpen: true,
            alertMessage: "Successfully Added",
            alertType: "success",
          },
        });
        dispatch({
          type: SET_REDIRECT,
          payload: { shallRedirect: true, redirectTo: "/company" },
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
        type: SET_COMPANY_STATE,
        payload: { loading: false },
      });
    }
  };
};

export const updateCompany = (
  company: CompanyDetails,
  token: string
): AppThunk => {
  return async (dispatch) => {
    const { name, isActive, id } = company;
    dispatch({
      type: SET_COMPANY_STATE,
      payload: { loading: true },
    });
    try {
      const companyRes = await axios.put(
        `${API_URL}company/${id}`,
        { name, isActive },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // to use, data is returned as prodRes.data
      if (companyRes.status === 200 || companyRes.status === 204) {
        dispatch({
          type: ALERT_STATE,
          payload: {
            alertOpen: true,
            alertMessage: "Successfully Updated",
            alertType: "success",
          },
        });
        dispatch({
          type: SET_REDIRECT,
          payload: { shallRedirect: true, redirectTo: "/company" },
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
        type: SET_COMPANY_STATE,
        payload: { loading: false },
      });
    }
  };
};

export const deleteCompany = (id: string | number, token: string): AppThunk => {
  return async (dispatch) => {
    try {
      const companyRes = await axios.delete(`${API_URL}company/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // to use, data is returned as prodRes.data
      if (companyRes.status === 200 || companyRes.status === 204) {
        dispatch({
          type: ALERT_STATE,
          payload: {
            alertOpen: true,
            alertMessage: "Successfully Deleted",
            alertType: "success",
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
    }
  };
};

// selectors - added by jeff
export const selectCompanyList = (state: AppState) => state.companyList;
