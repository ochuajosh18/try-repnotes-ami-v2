// State Interfaces
export interface Branch {
  id: string;
  companyId: string;
  name: string;
  isActive: boolean;
  dateCreated: string;
  dateUpdated: string;
}

export type BranchStatus = "idle" | "success" | "loading" | "failed";
export type BranchError = string | null;
export type BranchInput = Pick<Branch, "name" | "isActive">;

export interface BranchState {
  status: BranchStatus;
  data: Branch[];
  error?: BranchError;
  currentCompanyId?: string;
}

// Action Types
export const LOAD_BRANCH_DATA = "branch/fetch";
export const ADD_BRANCH = "branch/add";
export const EDIT_BRANCH = "branch/edit";
export const DELETE_BRANCH = "branch/delete";
export const UPDATE_BRANCH_STATUS = "branch/status";
export const SET_BRANCH_ERROR = "branch/error";
export const SET_BRANCH_CURRENT_COMPANY = "branch/company";
export const RESET_BRANCH_STATE = "branch/reset";

export interface LoadBranchDataAction {
  type: typeof LOAD_BRANCH_DATA;
  payload: Branch[];
}

export interface SetBranchCurrentCompanyAction {
  type: typeof SET_BRANCH_CURRENT_COMPANY;
  payload: { companyId: string };
}

export interface AddBranchAction {
  type: typeof ADD_BRANCH;
  payload: {
    newBranch: Branch;
  };
}

export interface EditBranchAction {
  type: typeof EDIT_BRANCH;
  payload: {
    id: string;
    updatedBranch: Branch;
  };
}

export interface DeleteBranchAction {
  type: typeof DELETE_BRANCH;
  payload: { id: string };
}

export interface UpdateBranchStatusAction {
  type: typeof UPDATE_BRANCH_STATUS;
  payload: { status: BranchStatus };
}

export interface SetBranchErrorAction {
  type: typeof SET_BRANCH_ERROR;
  payload: { error?: BranchError };
}

export interface ResetBranchAction {
  type: typeof RESET_BRANCH_STATE;
}

export type BranchAction =
  | LoadBranchDataAction
  | AddBranchAction
  | EditBranchAction
  | DeleteBranchAction
  | UpdateBranchStatusAction
  | SetBranchErrorAction
  | SetBranchCurrentCompanyAction
  | ResetBranchAction;
