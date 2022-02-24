import {
  SET_SESSION,
  DISPLAY_ACTIVE,
  TOGGLE_DRAWER_COLLAPSE,
  Session,
  SystemAction,
  RedirectPage,
  SET_REDIRECT,
  SET_INTERCEPTOR,
  ListItem,
  SET_SYSTEM_STATE,
  SystemStateInput,
  SystemStateType,
} from "./types";
import { LoginState, LOGOUT_USER } from "../login/types";
import { SET_CUSTOMER_STATE } from "../customerManagement/customer/types";
import { SET_CUSTOMER_TYPE_STATE } from "../listManagement/customerType/types";
import { SET_LOCATION_STATE } from "../customerManagement/location/types";
import { SET_INDUSTRY_STATE } from "../listManagement/industry/types";
import { SET_CATEGORY_STATE } from "../listManagement/category/types";
import { SET_PRODUCT_FAMILY_STATE } from "../listManagement/productFamily/types";
import { SET_MAKE_STATE } from "../listManagement/make/types";
import { SET_TURNOVER_STATE } from "../listManagement/turnover/types";
import { SET_INTERNATIONAL_LOCAL_STATE } from "../listManagement/internationalLocal/types";
import { SET_GOVERNMENT_PRIVATE_STATE } from "../listManagement/governmentPrivate/types";
import { SET_TIER_STATE } from "../listManagement/tier/types";
import { SET_PRODUCT_STATE } from "../productManagement/product/types";
import { ALERT_STATE } from "../alert/types";
import { AppState, AppThunk, persistor } from "..";
import { initAxiosCancelToken } from "../../util/utils";
import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  CancelTokenSource,
} from "axios";
let cancellableRequests: Array<CancelTokenSource | null> = [];
const API_URL = process.env.REACT_APP_API_URL;

export const setSystemState = (
  newState: SystemStateInput<SystemStateType>
): SystemAction => ({
  type: SET_SYSTEM_STATE,
  payload: newState,
});

export const setRedirect = (redirect: RedirectPage): SystemAction => {
  return {
    type: SET_REDIRECT,
    payload: redirect,
  };
};

export const setSession = (session: Session): SystemAction => {
  return {
    type: SET_SESSION,
    payload: session,
  };
};

export function logoutUser(session: Session, login?: LoginState): AppThunk {
  return (dispatch, getState) => {
    const { rememberUser } = getState().system;
    dispatch(resetAxiosInterceptors());
    dispatch({
      type: SET_SESSION,
      payload: { ...session, isLoggedIn: false },
    });

    dispatch({
      type: "reset_state",
      payload: undefined,
    });

    dispatch({
      type: LOGOUT_USER,
      payload: {
        username: rememberUser ? getState().login.username : "",
        rememberMe: rememberUser,
      },
    });
  };
}

export const setActiveSystem = (
  activeTab: string,
  subActive: string,
  secondSubActive: string
): SystemAction => ({
  type: DISPLAY_ACTIVE,
  payload: { activeTab, subActive, secondSubActive },
});

export const toggleDrawer = (collapse: boolean): SystemAction => ({
  type: TOGGLE_DRAWER_COLLAPSE,
  payload: collapse,
});

export const setInterceptor = (
  updatedToken?: string,
  updatedRefreshToken?: string
): AppThunk => {
  return async (dispatch, getState) => {
    const { system } = getState();
    const reqInterceptor = axios.interceptors.request.use(
      (config: AxiosRequestConfig) => {
        const { session } = system;
        if (session && !updatedToken) {
          config.headers["Authorization"] = `Bearer ${session.token}`;
          return config;
        }

        if (config.url === `${API_URL}user/login`) {
          const { REACT_APP_TOKEN } = process.env;
          config.headers["Authorization"] = `Bearer ${REACT_APP_TOKEN}`;
          return config;
        }

        config.headers["Authorization"] = `Bearer ${updatedToken}`;
        return config;
      }
    );

    const resInterceptor = axios.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError) => {
        const origReq: any = error.config;
        const { session } = getState().system;
        if (
          error.response?.status === 401 &&
          origReq.url === `${API_URL}user/renewToken`
        ) {
          dispatch({
            type: ALERT_STATE,
            payload: {
              alertOpen: true,
              alertMessage: "Session expired. Please login again.",
              alertType: "error",
            },
          });
          return Promise.reject(error);
        }

        if (error.response?.status === 401 && !origReq.retry && session) {
          origReq.retry = true;
          const instance = axios.create({
            headers: {
              Authorization: `Bearer ${session.refreshToken}`,
            },
          });
          return instance
            .post(`${API_URL}user/renewToken`, {
              userDetails: session.userDetails,
              accessToken: updatedToken ? updatedToken : session.token,
              refreshToken: updatedRefreshToken
                ? updatedRefreshToken
                : session.refreshToken,
            })
            .then(async (res: AxiosResponse) => {
              if (res.status === 201 || res.status === 200) {
                const session = getState().system.session;
                const newSession = {
                  ...session,
                  token: res.data.token,
                  refreshToken: res.data.refreshToken
                    ? res.data.refreshToken
                    : updatedRefreshToken,
                };
                dispatch(setSession(newSession));
                dispatch(resetAxiosInterceptors());
                axios.interceptors.request.eject(reqInterceptor);
                axios.interceptors.response.eject(resInterceptor);
                dispatch(setInterceptor(res.data.token, res.data.refreshToken));
                await persistor.flush();
                console.log("Refreshed session");
              }
              origReq.retry = false;
              return axios(origReq);
            })
            .catch((err) => {
              dispatch(resetAxiosInterceptors());
              return Promise.reject(err);
            });
        }
        return Promise.reject(error);
      }
    );

    dispatch({
      type: SET_INTERCEPTOR,
      payload: {
        requestId: reqInterceptor,
        responseId: resInterceptor,
      },
    });
  };
};

export const resetAxiosInterceptors = (updatedToken?: string): AppThunk => {
  return async (dispatch, getState) => {
    const { interceptors } = getState().system;
    if (interceptors) {
      axios.interceptors.request.eject(interceptors.requestId);
      axios.interceptors.response.eject(interceptors.responseId);
      console.log(
        "Cleared axios interceptors",
        interceptors,
        axios.interceptors
      );
    }

    if (updatedToken) dispatch(setInterceptor(updatedToken));
  };
};

export const loadListManagementItems =
  (listItems: Array<ListItem>, companyId?: string): AppThunk =>
  async (dispatch, getState) => {
    try {
      const { session } = getState().system;
      if (session) {
        cancellableRequests = []; // reset
        let salespersonResult,
          productResult,
          customerResult,
          locationResult,
          industryResult,
          customerTypeResult,
          categoryResult,
          productFamilyResult,
          makeResult,
          turnoverResult,
          tierResult,
          internationalLocalResult,
          governmentPrivateResult: AxiosResponse<any> | null = null;
        for (const item in listItems)
          cancellableRequests = [
            ...cancellableRequests,
            initAxiosCancelToken(cancellableRequests[item]),
          ];
        if (listItems.includes("Salesperson"))
          salespersonResult = await axios.get(
            `${API_URL}user?companyId=${
              companyId ? companyId : session.userDetails.companyId
            }&role=sales engineer`,
            {
              cancelToken:
                cancellableRequests[listItems.indexOf("Salesperson")]!.token,
            }
          );
        if (listItems.includes("Product"))
          productResult = await axios.get(
            `${API_URL}product?companyId=${
              companyId ? companyId : session.userDetails.companyId
            }`,
            {
              cancelToken:
                cancellableRequests[listItems.indexOf("Product")]!.token,
            }
          );
        if (listItems.includes("Customer"))
          customerResult = await axios.get(
            `${API_URL}customer?companyId=${
              companyId ? companyId : session.userDetails.companyId
            }`,
            {
              cancelToken:
                cancellableRequests[listItems.indexOf("Customer")]!.token,
            }
          );
        if (listItems.includes("Location"))
          locationResult = await axios.get(
            `${API_URL}location?companyId=${
              companyId ? companyId : session.userDetails.companyId
            }`,
            {
              cancelToken:
                cancellableRequests[listItems.indexOf("Location")]!.token,
            }
          );
        if (listItems.includes("Industry"))
          industryResult = await axios.get(
            `${API_URL}list/industry?companyId=${
              companyId ? companyId : session.userDetails.companyId
            }`,
            {
              cancelToken:
                cancellableRequests[listItems.indexOf("Industry")]!.token,
            }
          );
        if (listItems.includes("Customer Type"))
          customerTypeResult = await axios.get(
            `${API_URL}list/customerType?companyId=${
              companyId ? companyId : session.userDetails.companyId
            }`,
            {
              cancelToken:
                cancellableRequests[listItems.indexOf("Customer Type")]!.token,
            }
          );
        if (listItems.includes("Category"))
          categoryResult = await axios.get(
            `${API_URL}list/category?companyId=${
              companyId ? companyId : session.userDetails.companyId
            }`,
            {
              cancelToken:
                cancellableRequests[listItems.indexOf("Category")]!.token,
            }
          );
        if (listItems.includes("Product Family"))
          productFamilyResult = await axios.get(
            `${API_URL}list/product-family?companyId=${
              companyId ? companyId : session.userDetails.companyId
            }`,
            {
              cancelToken:
                cancellableRequests[listItems.indexOf("Product Family")]!.token,
            }
          );
        if (listItems.includes("Make"))
          makeResult = await axios.get(
            `${API_URL}list/make?companyId=${
              companyId ? companyId : session.userDetails.companyId
            }`,
            {
              cancelToken:
                cancellableRequests[listItems.indexOf("Make")]!.token,
            }
          );
        if (listItems.includes("Turnover"))
          turnoverResult = await axios.get(
            `${API_URL}list/turnover?companyId=${
              companyId ? companyId : session.userDetails.companyId
            }`,
            {
              cancelToken:
                cancellableRequests[listItems.indexOf("Turnover")]!.token,
            }
          );
        if (listItems.includes("Tier"))
          tierResult = await axios.get(
            `${API_URL}list/tier?companyId=${
              companyId ? companyId : session.userDetails.companyId
            }`,
            {
              cancelToken:
                cancellableRequests[listItems.indexOf("Tier")]!.token,
            }
          );
        if (listItems.includes("Internation/Local"))
          internationalLocalResult = await axios.get(
            `${API_URL}list/international-local?companyId=${
              companyId ? companyId : session.userDetails.companyId
            }`,
            {
              cancelToken:
                cancellableRequests[listItems.indexOf("Internation/Local")]!
                  .token,
            }
          );
        if (listItems.includes("Government/Private"))
          governmentPrivateResult = await axios.get(
            `${API_URL}list/government-private?companyId=${
              companyId ? companyId : session.userDetails.companyId
            }`,
            {
              cancelToken:
                cancellableRequests[listItems.indexOf("Government/Private")]!
                  .token,
            }
          );

        if (salespersonResult) {
          dispatch({
            type: SET_CUSTOMER_STATE,
            payload: { salesPersonList: salespersonResult.data },
          });
        }

        if (productResult) {
          dispatch({
            type: SET_PRODUCT_STATE,
            payload: { productList: productResult.data },
          });
        }

        if (customerResult) {
          dispatch({
            type: SET_CUSTOMER_STATE,
            payload: { customerList: customerResult.data },
          });
        }

        if (customerTypeResult) {
          dispatch({
            type: SET_CUSTOMER_TYPE_STATE,
            payload: { customerTypeList: customerTypeResult.data },
          });
        }
        if (locationResult) {
          dispatch({
            type: SET_LOCATION_STATE,
            payload: { locationList: locationResult.data },
          });
        }
        if (industryResult) {
          dispatch({
            type: SET_INDUSTRY_STATE,
            payload: { industryList: industryResult.data },
          });
        }
        if (categoryResult) {
          dispatch({
            type: SET_CATEGORY_STATE,
            payload: { categoryList: categoryResult.data },
          });
        }
        if (productFamilyResult) {
          dispatch({
            type: SET_PRODUCT_FAMILY_STATE,
            payload: { productFamilyList: productFamilyResult.data },
          });
        }
        if (makeResult) {
          dispatch({
            type: SET_MAKE_STATE,
            payload: { makeList: makeResult.data },
          });
        }
        if (turnoverResult) {
          dispatch({
            type: SET_TURNOVER_STATE,
            payload: { turnoverList: turnoverResult.data },
          });
        }
        if (tierResult) {
          dispatch({
            type: SET_TIER_STATE,
            payload: { tierList: tierResult.data },
          });
        }
        if (internationalLocalResult) {
          dispatch({
            type: SET_INTERNATIONAL_LOCAL_STATE,
            payload: { internationalLocalList: internationalLocalResult.data },
          });
        }
        if (governmentPrivateResult) {
          dispatch({
            type: SET_GOVERNMENT_PRIVATE_STATE,
            payload: { govermentPrivateList: governmentPrivateResult.data },
          });
        }
      }
    } catch (e) {
      if (e.response) {
        let msg = e.response.data.error.message;
        msg = msg.split(":").pop();
        dispatch({
          type: ALERT_STATE,
          payload: { alertOpen: true, alertMessage: msg, alertType: "error" },
        });
      }
    }
  };

export const resetReportsState = (): AppThunk => async (dispatch) => {
  dispatch({ type: "reset_report_state", payload: undefined });
  dispatch(resetListManagementState());
  dispatch(resetLocationState());
  dispatch(resetProductManagementState());
};
export const resetListManagementState = (): AppThunk => async (dispatch) =>
  dispatch({ type: "reset_list_management_state", payload: undefined });
export const resetLocationState = (): AppThunk => async (dispatch) =>
  dispatch({ type: "reset_location_state", payload: undefined });
export const resetProductManagementState = (): AppThunk => async (dispatch) =>
  dispatch({ type: "reset_product_management_state", payload: undefined });

// selectors - added by jeff
export const selectSystemSessionToken = (state: AppState) =>
  state.system.session.token;

export const selectCurrentUserRole = (state: AppState) =>
  state.system.session.userDetails.role as string;

export const selectCurrentUserCompany = (state: AppState) =>
  state.system.session.userDetails.companyId;

export const selectSystemState = (state: AppState) => state.system;
