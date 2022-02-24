import { AppState } from "../../index";

export const selectBranchState = (state: AppState) => state.branchState;

export const selectBranchById = (id: string) => (state: AppState) =>
  state.branchState.data.find((b) => b.id === id);

export const selectBranchMap = (state: AppState) => {
  return state.branchState.data.reduce<Record<string, string>>(
    (mapped, curr) => ({ ...mapped, [curr.id]: curr.name }),
    {}
  );
};
