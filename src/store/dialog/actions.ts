import { AppState } from "..";
import { DialogAction, DialogState, DIALOG_STATE } from "./types";

export const setDialogOpen = (dialog: DialogState): DialogAction => ({
  type: DIALOG_STATE,
  payload: dialog,
});

export const clearDialog = (): DialogAction => ({
  type: DIALOG_STATE,
  payload: {
    dialogOpen: false,
    dialogLabel: "",
    dialogType: "default",
    docId: "",
  },
});

// SELECTORS: added by jeff
export const selectDialogState = (state: AppState) => state.dialog;
