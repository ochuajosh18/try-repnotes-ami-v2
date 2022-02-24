import {
  ADD_BRANCH,
  BranchAction,
  BranchState,
  DELETE_BRANCH,
  EDIT_BRANCH,
  LOAD_BRANCH_DATA,
  RESET_BRANCH_STATE,
  SET_BRANCH_CURRENT_COMPANY,
  SET_BRANCH_ERROR,
  UPDATE_BRANCH_STATUS,
} from "./types";

const initialState: BranchState = {
  status: "idle",
  data: [],
};

const branchReducer = (state: BranchState = initialState, action: BranchAction): BranchState => {
  switch (action.type) {
    case UPDATE_BRANCH_STATUS:
      return {
        ...state,
        status: action.payload.status,
        error: action.payload.status !== "failed" ? null : state.error,
      };
    case SET_BRANCH_ERROR:
      return { ...state, error: action.payload.error };
    case SET_BRANCH_CURRENT_COMPANY:
      return { ...state, currentCompanyId: action.payload.companyId };
    case LOAD_BRANCH_DATA:
      return { ...state, data: action.payload, status: "success" };
    case ADD_BRANCH:
      return { ...state, data: [action.payload.newBranch, ...state.data] };
    case EDIT_BRANCH:
      return {
        ...state,
        data: state.data.map((b) =>
          b.id === action.payload.id ? action.payload.updatedBranch : b
        ),
      };
    case DELETE_BRANCH:
      return {
        ...state,
        data: state.data.filter((b) => b.id !== action.payload.id),
      };
    case RESET_BRANCH_STATE:
      return initialState;
    default:
      return state;
  }
};

export default branchReducer;
