import { AnyAction } from 'redux'

export interface LoginState {
    username: string;
    password: string;
    loading: boolean;
    rememberMe: boolean;
}

export interface LoginInput {
    [name: string]: string | number | boolean
}

export const LOGIN_INPUT = 'login_input'
export const LOGIN_SUCCESS = 'login_success'
export const LOGIN_FAILED = 'login_failed'
export const LOGIN_REQUEST = 'login_request'
export const LOGOUT_USER = 'logout_user'

export interface SetLoginInputAction {
    type: typeof LOGIN_INPUT
    payload: LoginState
}

export type LoginAction = SetLoginInputAction | AnyAction