import { AnyAction } from 'redux'

export interface RowData {
    [property : string] : string | number | boolean;
}

export interface User extends RowData {
    companyId: string;
    isActive: boolean;
    firstName: string;
    lastName: string;
    middleName: string;
    email: string;
    contactNo: string;
    roleId: string;
}

export interface UserState {
    userList: Array<User>;
    user?: User;
    loading: boolean;
    validation: boolean;
    selectedCompanyId: string;
}

export interface UserInput {
    [name: string]: string | number | boolean | RowData | Array<User>;
}

export interface UserValidation {
    validation: boolean
}

export interface SetSelectedCompanyFilter {
    selectedCompanyId: string
}

export const SET_USER_STATE = 'set_user_state'

export interface SetUserStateInput {
    type: typeof SET_USER_STATE
    payload: UserInput
}

export type UserAction =  SetUserStateInput | AnyAction