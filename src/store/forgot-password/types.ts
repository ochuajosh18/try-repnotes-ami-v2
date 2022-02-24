import { AnyAction } from 'redux'

export interface ForgotPasswordState {
    email: string;
    timer: number;
    loading: boolean;
    startTimer: boolean;
}

export interface ForgotPasswordInput {
    [name: string]: string | number | boolean
}

export const FORGOT_PASSWORD_REQUEST = 'forgot_password_request'
export const FORGOT_PASSWORD_INPUT = 'forgot_password_input'
export const START_TIMER = 'start_timer'
export const RESET_TIMER = 'reset_timer'

export interface SetForgotPasswordAction {
    type: typeof FORGOT_PASSWORD_INPUT
    payload: ForgotPasswordState
}

export type ForgotPasswordAction = SetForgotPasswordAction | AnyAction