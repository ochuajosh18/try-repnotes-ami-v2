import {
  SET_LOCATION_STATE,
  LocationAction,
  LocationDetails,
  LocationInput,
  LocationValidation,
  ActiveProvince,
  ActiveCity,
  ActiveType,
  AddressInput,
  ValidationMessageInput,
  SetSelectedLocationCompanyFilter,
} from "./types";
import { ALERT_STATE } from "../../alert/types";
import { SET_REDIRECT, SystemState } from "../../system/types";
import axios from "axios";
import { AppState, AppThunk } from "../..";
const API_URL = process.env.REACT_APP_API_URL;

export const setLocationState = (data: LocationInput): LocationAction => ({
  type: SET_LOCATION_STATE,
  payload: data,
});

export const setLocationCompanyFilter = (
  data: SetSelectedLocationCompanyFilter
): LocationAction => ({
  type: SET_LOCATION_STATE,
  payload: data,
});

export const setActiveProvince = (data: ActiveProvince): LocationAction => ({
  type: SET_LOCATION_STATE,
  payload: data,
});

export const setActiveCity = (data: ActiveCity): LocationAction => ({
  type: SET_LOCATION_STATE,
  payload: data,
});

export const setActiveType = (data: ActiveType): LocationAction => ({
  type: SET_LOCATION_STATE,
  payload: data,
});

export const setAddress = (data: AddressInput): LocationAction => ({
  type: SET_LOCATION_STATE,
  payload: data,
});

export const setLocationValidationState = (
  data: LocationValidation
): AppThunk => {
  return async (dispatch) => {
    dispatch({
      type: SET_LOCATION_STATE,
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
  };
};

export const setLocationValidationMessage = (
  msg: ValidationMessageInput
): AppThunk => {
  return async (dispatch) => {
    dispatch({
      type: ALERT_STATE,
      payload: {
        alertOpen: true,
        alertMessage: msg.validationMessage,
        alertType: "error",
      },
    });
  };
};

export const getLocationList = (
  system: SystemState,
  companyId: string
): AppThunk => {
  return async (dispatch) => {
    const { token } = system.session;
    dispatch({
      type: SET_LOCATION_STATE,
      payload: { loading: true, locationList: [] },
    });
    try {
      const payloadResult = await axios.get(
        `${API_URL}location?companyId=${
          companyId ? companyId : system.session.userDetails.companyId
        }`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // to use, data is returned as payloadResult
      if (payloadResult.status === 200 || payloadResult.status === 204) {
        dispatch({
          type: SET_LOCATION_STATE,
          payload: { locationList: [...payloadResult.data] },
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
        type: SET_LOCATION_STATE,
        payload: { loading: false },
      });
    }
  };
};

export const loadLocationDetails = (id: string, token: string): AppThunk => {
  return async (dispatch) => {
    dispatch({
      type: SET_LOCATION_STATE,
      payload: { loading: true },
    });
    try {
      const payloadResult = await axios.get(`${API_URL}location?id=${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // to use, data is returned as payloadResult
      if (payloadResult.status === 200 || payloadResult.status === 204) {
        dispatch({
          type: SET_LOCATION_STATE,
          payload: { location: payloadResult.data },
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
        type: SET_LOCATION_STATE,
        payload: { loading: false },
      });
    }
  };
};

export const saveLocation = (
  location: LocationDetails,
  system: SystemState,
  companyId: string
): AppThunk => {
  return async (dispatch) => {
    const { token } = system.session;
    dispatch({
      type: SET_LOCATION_STATE,
      payload: { loading: true },
    });
    try {
      location.companyId = companyId
        ? companyId
        : system.session.userDetails.companyId;
      const payloadResult = await axios.post(`${API_URL}location`, location, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (payloadResult.status === 200 || payloadResult.status === 204) {
        dispatch({
          type: ALERT_STATE,
          payload: {
            alertOpen: true,
            alertMessage: "Successfully Saved",
            alertType: "success",
          },
        });
        dispatch({
          type: SET_REDIRECT,
          payload: { shallRedirect: true, redirectTo: "/location" },
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
        type: SET_LOCATION_STATE,
        payload: { loading: false },
      });
    }
  };
};

export const updateLocationDetails = (
  data: LocationDetails,
  token: string
): AppThunk => {
  return async (dispatch) => {
    dispatch({
      type: SET_LOCATION_STATE,
      payload: { loading: true },
    });
    try {
      const payloadResult = await axios.put(
        `${API_URL}location/${data.id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (payloadResult.status === 200 || payloadResult.status === 204) {
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
          payload: { shallRedirect: true, redirectTo: "/location" },
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
        type: SET_LOCATION_STATE,
        payload: { loading: false },
      });
    }
  };
};

export const deleteLocation = (
  id: string | number,
  token: string,
  province: string,
  city: string
): AppThunk => {
  return async (dispatch) => {
    try {
      const payloadResult = await axios.get(`${API_URL}location?id=${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // to use, data is returned as prodRes.data
      if (payloadResult.status === 200 || payloadResult.status === 204) {
        let newData: LocationDetails = payloadResult.data;
        let provinceIndex = newData.province.findIndex(
          (item) => item.name === province
        );
        newData.province[provinceIndex].city = newData.province[
          provinceIndex
        ].city.filter((item) => item !== city && item);
        if (newData.province[provinceIndex].city.length === 0)
          newData.province = newData.province.filter(
            (item) => item.name !== province && item
          );
        const payloadData =
          newData.province.length === 0
            ? await axios.delete(`${API_URL}location/${id}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              })
            : await axios.put(`${API_URL}location/${id}`, newData, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
        if (payloadData.status === 200 || payloadData.status === 204) {
          dispatch({
            type: ALERT_STATE,
            payload: {
              alertOpen: true,
              alertMessage: "Successfully Deleted",
              alertType: "success",
            },
          });
        }
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

// Selectors , added by jeff
export const selectLocationState = (state: AppState) => state.locationState;
