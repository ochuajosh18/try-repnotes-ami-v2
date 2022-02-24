import { AnyAction } from 'redux'

export interface FormatData {
    [property : string] : string | number | boolean | RolesList | Modules | Array<Modules> | Permissions | Array<string>;
}

export interface DynamicObject<T> {
    [name: string]: T;
}

export interface Permissions extends DynamicObject<string | boolean | any>{
    add?: boolean | string;
    edit?: boolean | string;
    delete?: boolean | string;
    view?: boolean | string;
}

export interface Modules {
    [name: string]: Permissions;
}

export interface RolesList extends FormatData{
    companyId: string;
    name: string;
    description: string;
    modules: Modules;
    id: string;
}

export interface RolesState {
    rolesList: Array<RolesList>;
    roles: RolesList;
    loading: boolean;
    validation: boolean;
    selectedCompanyId: string;
}

export interface RolesInput {
    [name: string]: string | number | boolean | RolesList | Modules | Array<Modules> | Permissions | Array<string> | FormatData;
}

export interface RolesValidation {
    validation: boolean
}

export interface SetSelectedRolesCompanyFilter {
    selectedCompanyId: string
}

export const SET_ROLES_STATE = 'set_roles_state'

export interface SetRolesStateInput {
    type: typeof SET_ROLES_STATE
    payload: RolesInput
}

export type RolesAction =  SetRolesStateInput | AnyAction