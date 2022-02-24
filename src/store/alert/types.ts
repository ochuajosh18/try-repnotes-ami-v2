import { AnyAction } from 'redux'

export interface AlertState {
    alertOpen: boolean,
    alertMessage: string,
    alertType: 'success' | 'error' | 'warning' | 'info'
}

export const ALERT_STATE = 'alert_state'
export const ALERT_CLEAR = 'alert_clear'

export interface SetAlertAction{
    type: typeof ALERT_CLEAR
    payload: AlertState
}

export type AlertAction = SetAlertAction | AnyAction