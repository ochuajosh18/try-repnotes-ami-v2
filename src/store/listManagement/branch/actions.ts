import { AppThunk } from "../..";
import { executeApiCall } from "../../../util/utils";
import { openAlert } from "../../alert/actions";
import { clearDialog } from "../../dialog/actions";
import {
  Branch,
  BranchAction,
  BranchError,
  BranchInput,
  BranchStatus,
  DELETE_BRANCH,
  LOAD_BRANCH_DATA,
  RESET_BRANCH_STATE,
  SET_BRANCH_CURRENT_COMPANY,
  SET_BRANCH_ERROR,
  UPDATE_BRANCH_STATUS,
} from "./types";

const url = "list/branch";
const successResponses = [200, 201, 204];

// SYNC Action Creators
const updateBranchStatus = (status: BranchStatus): BranchAction => ({
  type: UPDATE_BRANCH_STATUS,
  payload: { status },
});

export const loadBranchData = (data: Branch[]): BranchAction => ({
  type: LOAD_BRANCH_DATA,
  payload: data,
});

const setBranchError = (error: BranchError): BranchAction => ({
  type: SET_BRANCH_ERROR,
  payload: { error },
});

export const setBranchCurrentCompany = (companyId: string): BranchAction => ({
  type: SET_BRANCH_CURRENT_COMPANY,
  payload: { companyId },
});

export const resetBranchState = (): BranchAction => ({
  type: RESET_BRANCH_STATE,
});

// ASYNC Actions (Thunk Actions)
export const fetchBranchList =
  (companyId?: string): AppThunk =>
  async (dispatch, getState) => {
    try {
      dispatch(updateBranchStatus("loading"));
      const system = getState().system;
      const token = system.session.token;
      const _companyId = companyId ? companyId : system.session.userDetails.companyId;

      const response = await executeApiCall(token).get(`${url}?companyId=${_companyId}`);

      dispatch(loadBranchData(response.data));
    } catch (err: any) {
      handleError(err, dispatch);
    } finally {
      dispatch(updateBranchStatus("idle"));
    }
  };

export const createBranch =
  (branch: BranchInput, successCb?: () => void): AppThunk =>
  async (dispatch, getState) => {
    try {
      dispatch(updateBranchStatus("loading"));

      const system = getState().system;
      const { currentCompanyId } = getState().branchState;
      const token = system.session.token;
      const companyId = currentCompanyId ? currentCompanyId : system.session.userDetails.companyId;

      const data = { ...branch, companyId };
      const response = await executeApiCall(token).post(url, data);

      if (successResponses.includes(response.status)) {
        dispatch(clearDialog());
        dispatch(updateBranchStatus("success"));
        dispatch(openAlert("Successfully saved!", "success"));

        if (successCb) successCb();
      }
    } catch (err: any) {
      handleError(err, dispatch);
    } finally {
      dispatch(updateBranchStatus("idle"));
    }
  };

export const editBranch =
  (id: string, branch: BranchInput, successCb?: () => void): AppThunk =>
  async (dispatch, getState) => {
    try {
      dispatch(updateBranchStatus("loading"));
      const system = getState().system;
      const { currentCompanyId } = getState().branchState;
      const token = system.session.token;
      const companyId = currentCompanyId ? currentCompanyId : system.session.userDetails.companyId;

      const data = { ...branch, companyId };
      const response = await executeApiCall(token).put(`${url}/${id}`, data);

      if (successResponses.includes(response.status)) {
        dispatch(clearDialog());
        dispatch(updateBranchStatus("success"));
        dispatch(openAlert("Successfully saved!", "success"));

        if (successCb) successCb();
      }
    } catch (err: any) {
      handleError(err, dispatch);
    } finally {
      dispatch(updateBranchStatus("idle"));
    }
  };

export const deleteBranch =
  (id: string): AppThunk =>
  async (dispatch, getState) => {
    try {
      dispatch(updateBranchStatus("loading"));

      const system = getState().system;
      const token = system.session.token;

      await executeApiCall(token).delete(`${url}/${id}`);

      // show success message
      dispatch(clearDialog());
      dispatch(openAlert("Successfully deleted!", "success"));

      dispatch({ type: DELETE_BRANCH, payload: { id } });
    } catch (err: any) {
      handleError(err, dispatch);
    } finally {
      dispatch(updateBranchStatus("idle"));
    }
  };

const handleError = (err: any, dispatch: any) => {
  let message = "Error";

  if (err?.response?.data) {
    const error = err.response.data.error;
    message = error.message ? error.message.split(": ")[1] : "Error";
  }

  dispatch(updateBranchStatus("failed"));
  dispatch(setBranchError(message));

  // show error message
  dispatch(openAlert(message, "error"));

  dispatch(clearDialog());
};
