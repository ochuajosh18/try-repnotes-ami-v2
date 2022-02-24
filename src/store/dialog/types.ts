import { AnyAction } from 'redux'

export interface DialogState {
    dialogOpen: boolean,
    dialogLabel: string | number,
    dialogType: 'save' | 'delete' | 'default',
    docId: string | number,
}

export const DIALOG_STATE = 'dialog_state'

export interface SetDialogAction{
    type: typeof DIALOG_STATE
    payload: DialogState
}

export type DialogAction = SetDialogAction | AnyAction