import {
    AlertAction,
    ALERT_CLEAR,
    ALERT_STATE
} from './types'

export const clearAlert = (): AlertAction => ({
    type : ALERT_CLEAR
});

export const openDeleteDialog = (): AlertAction => ({
    type : ALERT_CLEAR
});

export const openAlert =  ( msg: string, type: string): AlertAction => ({
    type: ALERT_STATE,
    payload: {alertOpen: true, alertMessage: msg, alertType: type}
});

