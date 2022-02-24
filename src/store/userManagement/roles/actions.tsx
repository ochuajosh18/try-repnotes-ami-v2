import {
    RolesAction,
    RolesInput,
    RolesList,
    RolesValidation,
    SetSelectedRolesCompanyFilter,
    SET_ROLES_STATE
} from './types'
import { 
    ALERT_STATE
} from '../../alert/types';
import { SET_REDIRECT, SystemState } from '../../system/types';
import { AppThunk } from '../..';
import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;


export const setRolesState = (data: RolesInput): RolesAction => ({
    type : SET_ROLES_STATE,
    payload: data
});

export const setRolesCompanyFilter = (data: SetSelectedRolesCompanyFilter): RolesAction => ({
    type : SET_ROLES_STATE,
    payload: data
});

export const setRolesValidationState = (data: RolesValidation): AppThunk => {
    return async (dispatch) => {
        dispatch({
            type: SET_ROLES_STATE,
            payload: data
        })
        dispatch({
            type: ALERT_STATE,
            payload: {alertOpen: true, alertMessage: "Please Check Required Field", alertType: 'error'}
        });
    }
};

export const getRolesList = (system: SystemState, companyId: string): AppThunk => {
    return async (dispatch) => {
        const { token } = system.session
        dispatch({
            type: SET_ROLES_STATE,
            payload: { loading: true, rolesList: [] }
        });
        try {
            const payloadResult = await axios.get(`${API_URL}role?companyId=${companyId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            // to use, data is returned as payloadResult
            if (payloadResult.status === 200 || payloadResult.status === 204) {
                dispatch({
                    type: SET_ROLES_STATE,
                    payload: { rolesList: [...payloadResult.data] }
                });
            }
        }catch(err){
            if (err.response) {
                let msg = err.response.data.error.message
                msg = msg.split(':').pop();
                dispatch({
                    type: ALERT_STATE,
                    payload: {alertOpen: true, alertMessage: msg, alertType: 'error'}
                });
            }
        }finally {
            dispatch({
                type: SET_ROLES_STATE,
                payload: { loading: false }
            });
        }
    }
}

export const loadRolesDetails = (id: string, token: string): AppThunk => {
    return async (dispatch) => {
        dispatch({
            type: SET_ROLES_STATE,
            payload: { loading: true }
        });
        try {
            const payloadResult = await axios.get(`${API_URL}role?id=${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            // to use, data is returned as payloadResult
            if (payloadResult.status === 200 || payloadResult.status === 204) {
                dispatch({
                    type: SET_ROLES_STATE,
                    payload: { roles: payloadResult.data }
                });
            }
        }catch(err){
            if (err.response) {
                let msg = err.response.data.error.message
                msg = msg.split(':').pop();
                dispatch({
                    type: ALERT_STATE,
                    payload: {alertOpen: true, alertMessage: msg, alertType: 'error'}
                });
            }
        }finally {
            dispatch({
                type: SET_ROLES_STATE,
                payload: { loading: false }
            });
        }
    }
}

export const saveRoles = ( data: RolesList, system: SystemState, companyId: string ): AppThunk => {
    return async (dispatch, getState) => {
        const { token } = system.session;
        dispatch({
            type: SET_ROLES_STATE,
            payload: { loading: true }
        });
        try {
            data.companyId = companyId; 
            const payloadResult = await axios.post(`${API_URL}role`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (payloadResult.status === 200 || payloadResult.status === 204) {
                dispatch({
                    type: ALERT_STATE,
                    payload: { alertOpen : true, alertMessage: "Successfully Saved", alertType: "success"  }
                });
                dispatch({
                    type: SET_REDIRECT,
                    payload: { shallRedirect: true, redirectTo: '/roles-and-permission' }
                });
                dispatch(getRolesList(getState().system, companyId));
            }
        }catch(err){
            if (err.response) {
                let msg = err.response.data.error.message
                msg = msg.split(':').pop();
                dispatch({
                    type: ALERT_STATE,
                    payload: {alertOpen: true, alertMessage: msg, alertType: 'error'}
                });
            }
        }finally {
            dispatch({
                type: SET_ROLES_STATE,
                payload: { loading: false }
            });
        }
    }
}

export const updateRole = ( data: RolesList, token: string ): AppThunk => {
    return async (dispatch) => {
        dispatch({
            type: SET_ROLES_STATE,
            payload: { loading: true }
        });
        try {
            const { name, description, modules, companyId } = data; 
            const payloadResult = await axios.put(`${API_URL}role/${data.id}`, 
                {
                    name, description, modules, companyId
                },{
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if(payloadResult.status === 200 || payloadResult.status === 204) {
                dispatch({
                    type: ALERT_STATE,
                    payload: { alertOpen : true, alertMessage: "Successfully Updated", alertType: "success"  }
                });
                dispatch({
                    type: SET_REDIRECT,
                    payload: { shallRedirect: true, redirectTo: '/roles-and-permission' }
                });
            }
        }catch(err){
            if (err.response) {
                let msg = err.response.data.error.message
                msg = msg.split(':').pop();
                dispatch({
                    type: ALERT_STATE,
                    payload: {alertOpen: true, alertMessage: msg, alertType: 'error'}
                });
            }
        }finally {
            dispatch({
                type: SET_ROLES_STATE,
                payload: { loading: false }
            });
        }
    }
}


export const deleteRole= (id: string | number, token: string): AppThunk => {
    return async (dispatch) => {
        try {
            const payloadResult = await axios.delete(`${API_URL}role/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            // to use, data is returned as prodRes.data
            if (payloadResult.status === 200 || payloadResult.status === 204) {
                dispatch({
                    type: ALERT_STATE,
                    payload: {alertOpen: true, alertMessage: 'Successfully Deleted', alertType: 'success'}
                });
            }
        }catch(err){
            let msg = err.response.data.error.message
            msg = msg.split(':').pop();
            dispatch({
                type: ALERT_STATE,
                payload: {alertOpen: true, alertMessage: msg, alertType: 'error'}
            });
        }
    }
};