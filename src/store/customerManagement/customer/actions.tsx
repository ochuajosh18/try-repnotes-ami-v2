import {
  SET_CUSTOMER_STATE,
  CustomerAction,
  CustomerDetails,
  CustomerInput,
  CustomerValidation,
  CustomerSeachInput,
  CustomerApproval,
  SetSelectedCompanyFilter,
  Media,
} from "./types";
import { ALERT_STATE } from "../../alert/types";
import { SET_REDIRECT, SystemState } from "../../system/types";
import { AppState, AppThunk } from "../..";
import axios from "axios";
import filter from "lodash/filter";
import { uploadMedia } from "../../../util/upload";
const API_URL = process.env.REACT_APP_API_URL;

export const setCustomerState = (data: CustomerInput): CustomerAction => ({
  type: SET_CUSTOMER_STATE,
  payload: data,
});

export const setCompanyFilter = (
  data: SetSelectedCompanyFilter
): CustomerAction => ({
  type: SET_CUSTOMER_STATE,
  payload: data,
});

export const setCustomerSearch = (
  data: CustomerSeachInput
): CustomerAction => ({
  type: SET_CUSTOMER_STATE,
  payload: data,
});

export const setCustomerApproval = (
  data: CustomerApproval
): CustomerAction => ({
  type: SET_CUSTOMER_STATE,
  payload: data,
});

export const setCustomerValidationState = (
  data: CustomerValidation
): AppThunk => {
  return async (dispatch) => {
    dispatch({
      type: SET_CUSTOMER_STATE,
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

export const getCustomerList = (
  system: SystemState,
  companyId: string
): AppThunk => {
  return async (dispatch) => {
    const { token } = system.session;
    dispatch({
      type: SET_CUSTOMER_STATE,
      payload: { loading: true, customerList: [] },
    });
    try {
      const payloadResult = await axios.get(
        `${API_URL}customer?companyId=${
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
          type: SET_CUSTOMER_STATE,
          payload: { customerList: [...payloadResult.data] },
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
        type: SET_CUSTOMER_STATE,
        payload: { loading: false },
      });
    }
  };
};

export const loadCustomerDetails = (id: string, token: string): AppThunk => {
  return async (dispatch) => {
    dispatch({
      type: SET_CUSTOMER_STATE,
      payload: { loading: true },
    });
    try {
      const payloadResult = await axios.get(`${API_URL}customer?id=${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // to use, data is returned as payloadResult
      if (payloadResult.status === 200 || payloadResult.status === 204) {
        dispatch({
          type: SET_CUSTOMER_STATE,
          payload: { customer: payloadResult.data },
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
        type: SET_CUSTOMER_STATE,
        payload: { loading: false },
      });
    }
  };
};

export const saveCustomerWithAddedFields = (
  formData: CustomerDetails | any,
  companyId: string
): AppThunk => {
  return async (dispatch, getState) => {
    const system = getState().system;
    const { token } = system.session;

    let data = { ...formData };

    dispatch({
      type: SET_CUSTOMER_STATE,
      payload: { loading: true },
    });

    try {
      if (data.category === "Child" && data.groupName === "")
        return dispatch({
          type: ALERT_STATE,
          payload: {
            alertOpen: true,
            alertMessage: "Please Select a Group Name",
            alertType: "warning",
          },
        });

      // continue
      for (const key of Object.keys(data)) {
        // if the key is an array and
        // each item has a `file` & `name` properties, that's a media
        if (
          Array.isArray(data[key]) &&
          Array.from(data[key] as Media[]).every((e) => e.file && e.name)
        ) {
          let filesToUpload: Array<File> = [];
          for (const med in data[key]) {
            const me = data[key][med] as Media;
            if (me && me.file) {
              filesToUpload = [...filesToUpload, me.file];
            }
          }

          data = {
            ...data,
            [key]: [
              ...filter(data[key] as Array<Media>, (u) => !u.file),
              ...(await uploadMedia(filesToUpload, "customer")),
            ],
          };
        }
      }
      data.companyId = companyId;
      const payloadResult = await axios.post(`${API_URL}customer`, data, {
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
          payload: { shallRedirect: true, redirectTo: "/customer" },
        });
      }
    } catch (err: any) {
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
        type: SET_CUSTOMER_STATE,
        payload: { loading: false },
      });
    }
  };
};

export const updateCustomerWithAddedFields = (formData: any): AppThunk => {
  return async (dispatch, getState) => {
    const system = getState().system;
    const { token } = system.session;

    let data = { ...formData };

    dispatch({
      type: SET_CUSTOMER_STATE,
      payload: { loading: true },
    });
    try {
      if (data.category === "Child" && data.groupName === "")
        return dispatch({
          type: ALERT_STATE,
          payload: {
            alertOpen: true,
            alertMessage: "Please Select a Group Name",
            alertType: "warning",
          },
        });

      // continue
      for (const key of Object.keys(data)) {
        // if the key is an array and
        // each item has a `file` & `name` properties, that's a media
        if (
          Array.isArray(data[key]) &&
          Array.from(data[key] as Media[]).every((e) => e.file && e.name)
        ) {
          let filesToUpload: Array<File> = [];
          for (const med in data[key]) {
            const me = data[key][med] as Media;
            if (me && me.file) {
              filesToUpload = [...filesToUpload, me.file];
            }
          }

          data = {
            ...data,
            [key]: [
              ...filter(data[key] as Array<Media>, (u) => !u.file),
              ...(await uploadMedia(filesToUpload, "customer")),
            ],
          };
        }
      }

      const payloadResult = await axios.put(
        `${API_URL}customer/${data.id}`,
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
          payload: { shallRedirect: true, redirectTo: "/customer" },
        });
      }
    } catch (err: any) {
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
        type: SET_CUSTOMER_STATE,
        payload: { loading: false },
      });
    }
  };
};

export const saveCustomer = (
  customer: CustomerDetails,
  system: SystemState,
  companyId: string
): AppThunk => {
  return async (dispatch) => {
    const { token } = system.session;
    dispatch({
      type: SET_CUSTOMER_STATE,
      payload: { loading: true },
    });
    try {
      if (customer.category === "Child" && customer.groupName === "") {
        dispatch({
          type: ALERT_STATE,
          payload: {
            alertOpen: true,
            alertMessage: "Please Select a Group Name",
            alertType: "warning",
          },
        });
      } else {
        customer.companyId = companyId;
        const payloadResult = await axios.post(`${API_URL}customer`, customer, {
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
            payload: { shallRedirect: true, redirectTo: "/customer" },
          });
        }
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
        type: SET_CUSTOMER_STATE,
        payload: { loading: false },
      });
    }
  };
};

export const updateCustomerDetails = (
  customer: CustomerDetails,
  token: string
): AppThunk => {
  return async (dispatch) => {
    dispatch({
      type: SET_CUSTOMER_STATE,
      payload: { loading: true },
    });
    try {
      if (customer.category === "Child" && customer.groupName === "") {
        dispatch({
          type: ALERT_STATE,
          payload: {
            alertOpen: true,
            alertMessage: "Please Select a Group Name",
            alertType: "warning",
          },
        });
      } else {
        const payloadResult = await axios.put(
          `${API_URL}customer/${customer.id}`,
          customer,
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
            payload: { shallRedirect: true, redirectTo: "/customer" },
          });
        }
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
        type: SET_CUSTOMER_STATE,
        payload: { loading: false },
      });
    }
  };
};

export const updateCustomerStatus = (
  newStatus: string,
  docId: string,
  system: SystemState,
  companyId: string
): AppThunk => {
  return async (dispatch) => {
    const { token } = system.session;
    dispatch({
      type: SET_CUSTOMER_STATE,
      payload: { loading: true },
    });
    try {
      const payloadUpdate = await axios.put(
        `${API_URL}customer/${docId}?status=${newStatus}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (payloadUpdate.status === 200 || payloadUpdate.status === 204) {
        const payloadResult = await axios.get(
          `${API_URL}customer?companyId=${
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
            type: SET_CUSTOMER_STATE,
            payload: { customerList: [...payloadResult.data] },
          });
          dispatch({
            type: ALERT_STATE,
            payload: {
              alertOpen: true,
              alertMessage: `Successfully ${newStatus
                .charAt(0)
                .toUpperCase()}${newStatus.slice(1)}`,
              alertType: "success",
            },
          });
        }
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
        type: SET_CUSTOMER_STATE,
        payload: { loading: false },
      });
      dispatch({
        type: SET_CUSTOMER_STATE,
        payload: { approval: false },
      });
    }
  };
};

export const deleteCustomer = (
  id: string | number,
  token: string
): AppThunk => {
  return async (dispatch) => {
    try {
      const payloadResult = await axios.delete(`${API_URL}customer/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // to use, data is returned as prodRes.data
      if (payloadResult.status === 200 || payloadResult.status === 204) {
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

export const getSalesPersonList = (
  system: SystemState,
  companyId: string
): AppThunk => {
  return async (dispatch) => {
    const { token } = system.session;
    dispatch({
      type: SET_CUSTOMER_STATE,
      payload: { loading: true, salesPersonList: [] },
    });
    try {
      const payloadResult = await axios.get(
        `${API_URL}user?companyId=${
          companyId ? companyId : system.session.userDetails.companyId
        }&role=sales engineer`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // to use, data is returned as payloadResult
      if (payloadResult.status === 200 || payloadResult.status === 204) {
        dispatch({
          type: SET_CUSTOMER_STATE,
          payload: { salesPersonList: [...payloadResult.data] },
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
        type: SET_CUSTOMER_STATE,
        payload: { loading: false },
      });
    }
  };
};

export const getLocationList = (
  system: SystemState,
  companyId: string
): AppThunk => {
  return async (dispatch) => {
    const { token } = system.session;
    dispatch({
      type: SET_CUSTOMER_STATE,
      payload: { loading: true, salesPersonList: [] },
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
          type: SET_CUSTOMER_STATE,
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
        type: SET_CUSTOMER_STATE,
        payload: { loading: false },
      });
    }
  };
};

export const exportCustomer =
  (companyId: string): AppThunk =>
  async (dispatch, getState) => {
    dispatch({
      type: SET_CUSTOMER_STATE,
      payload: { loading: true },
    });
    try {
      const { session } = getState().system;
      const reportRes = await axios.get(
        `${API_URL}customer/export?companyId=${
          companyId ? companyId : session.userDetails.companyId
        }`,
        {
          responseType: "blob",
        }
      );
      if (reportRes.status === 200 || reportRes.status === 204) {
        const url = window.URL.createObjectURL(new Blob([reportRes.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "customer.xlsx");
        document.body.appendChild(link);
        link.click();
      }
    } catch (err) {
      if (err.response.data.error) {
        let msg = err.response.data.error.message;
        msg = msg.split(":").pop();
        dispatch({
          type: ALERT_STATE,
          payload: { alertOpen: true, alertMessage: msg, alertType: "error" },
        });
      } else {
        dispatch({
          type: ALERT_STATE,
          payload: {
            alertOpen: true,
            alertMessage: "Something went wrong while downloading the file",
            alertType: "error",
          },
        });
      }
    } finally {
      dispatch({
        type: SET_CUSTOMER_STATE,
        payload: { loading: false },
      });
    }
  };

export const importCustomerList =
  (productFile: File, userCompanyId?: string): AppThunk =>
  async (dispatch, getState) => {
    try {
      dispatch({
        type: SET_CUSTOMER_STATE,
        payload: { importLoading: true },
      });
      const {
        userDetails: { companyId },
      } = getState().system.session;
      const form = new FormData();
      form.append("uploads[]", productFile, productFile.name);
      const importRes = await axios.post(
        `${API_URL}media/excel/upload/customer?companyId=${
          userCompanyId ? userCompanyId : companyId
        }`,
        form
      );
      if ([200, 204].includes(importRes.status)) {
        dispatch({
          type: SET_CUSTOMER_STATE,
          payload: {
            importCustomerList: importRes.data,
            dialogOpen: true,
          },
        });
      }
    } catch (e) {
      let msg = "";
      if (e.response) {
        e.response.status === 409
          ? (msg = e.response.data.message)
          : (msg = e.response.data.error.message);
        dispatch({
          type: ALERT_STATE,
          payload: {
            alertOpen: true,
            alertMessage: msg.split(":").pop(),
            alertType: "error",
          },
        });
      } else console.log(e);
    } finally {
      dispatch({
        type: SET_CUSTOMER_STATE,
        payload: { importLoading: false },
      });
    }
  };

export const saveImportCustomerList =
  (): AppThunk => async (dispatch, getState) => {
    try {
      dispatch({
        type: SET_CUSTOMER_STATE,
        payload: { importLoading: true },
      });
      const {
        userDetails: { companyId },
      } = getState().system.session;
      const { selectedCompanyId, importCustomerList } =
        getState().customerState;
      const importRes = await axios.post(
        `${API_URL}customer/import?companyId=${
          selectedCompanyId ? selectedCompanyId : companyId
        }`,
        importCustomerList
      );
      if (importRes.status === 200) {
        dispatch({
          type: ALERT_STATE,
          payload: {
            alertOpen: true,
            alertMessage: "Customers successfully imported",
            alertType: "success",
          },
        });
        dispatch({
          type: SET_CUSTOMER_STATE,
          payload: {
            importCustomerList: importRes.data.importCustomerData,
          },
        });
        dispatch(
          getCustomerList(
            getState().system,
            selectedCompanyId ? selectedCompanyId : companyId
          )
        );
      }
    } catch (e) {
      let msg = "";
      if (e.response) {
        e.response.status === 409
          ? (msg = e.response.data.message)
          : (msg = e.response.data.error.message);
        dispatch({
          type: ALERT_STATE,
          payload: {
            alertOpen: true,
            alertMessage: msg.split(":").pop(),
            alertType: "error",
          },
        });
      } else console.log(e);
    } finally {
      dispatch({
        type: SET_CUSTOMER_STATE,
        payload: { importLoading: false, summaryDialog: true },
      });
    }
  };

// selectors [added by jeff]
export const selectCustomerState = (state: AppState) => state.customerState;
