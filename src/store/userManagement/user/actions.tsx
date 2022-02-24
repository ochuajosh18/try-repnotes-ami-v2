import {
    SetSelectedCompanyFilter,
    SET_USER_STATE,
    User,
    UserAction,
    UserInput,
    UserValidation
} from './types'
import { 
    ALERT_STATE
} from '../../alert/types';
import { SET_REDIRECT, SystemState } from '../../system/types';
import { AppThunk } from '../..';
import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;


export const setUserState = (data: UserInput): UserAction => ({
    type : SET_USER_STATE,
    payload: data
});

export const setCompanyFilter = (data: SetSelectedCompanyFilter): UserAction => ({
    type : SET_USER_STATE,
    payload: data
});

export const superAdminCompanyValidation = (): AppThunk => {
    return async (dispatch) => {
        dispatch({
            type: ALERT_STATE,
            payload: {alertOpen: true, alertMessage: "Please Select a company", alertType: 'warning'}
        });
    }
};

export const setUserValidationState = (data: UserValidation): AppThunk => {
    return async (dispatch) => {
        dispatch({
            type: SET_USER_STATE,
            payload: data
        })
        dispatch({
            type: ALERT_STATE,
            payload: {alertOpen: true, alertMessage: "Please Check Required Field", alertType: 'error'}
        });
    }
};

export const getUserList = (system: SystemState, companyId: string): AppThunk => {
    return async (dispatch) => {
        const { token } = system.session
        dispatch({
            type: SET_USER_STATE,
            payload: { loading: true, userList: [] }
        });
        try {
            const payloadResult = await axios.get(`${API_URL}user?companyId=${companyId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            // to use, data is returned as payloadResult
            if (payloadResult.status === 200 || payloadResult.status === 204) {
                dispatch({
                    type: SET_USER_STATE,
                    payload: { userList: [...payloadResult.data] }
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
                type: SET_USER_STATE,
                payload: { loading: false }
            });
        }
    }
}

export const loadUserDetails = (id: string, token: string): AppThunk => {
    return async (dispatch) => {
        dispatch({
            type: SET_USER_STATE,
            payload: { loading: true }
        });
        try {
            const payloadResult = await axios.get(`${API_URL}user?id=${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            // to use, data is returned as payloadResult
            if (payloadResult.status === 200 || payloadResult.status === 204) {
                dispatch({
                    type: SET_USER_STATE,
                    payload: { user: payloadResult.data }
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
                type: SET_USER_STATE,
                payload: { loading: false }
            });
        }
    }
}

export const saveUser = ( user: User, system: SystemState, companyId: string ): AppThunk => {
    return async (dispatch) => {
        const { token } = system.session;
        dispatch({
            type: SET_USER_STATE,
            payload: { loading: true }
        });
        try {
            user.companyId = companyId; 
            const payloadResult = await axios.post(`${API_URL}user`, user, {
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
                    payload: { shallRedirect: true, redirectTo: '/user' }
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
                type: SET_USER_STATE,
                payload: { loading: false }
            });
        }
    }
}

export const updateUserDetails = ( user: User, token: string ): AppThunk => {
    return async (dispatch) => {
        dispatch({
            type: SET_USER_STATE,
            payload: { loading: true }
        });
        try {
            const { isActive, firstName, lastName, middleName, email, contactNo, roleId } = user; 
            const payloadResult = await axios.put(`${API_URL}user/${user.id}`, 
                {
                    isActive, firstName, lastName, middleName, email, contactNo, roleId
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            
            if(payloadResult.status === 200 || payloadResult.status === 204) {
                dispatch({
                    type: ALERT_STATE,
                    payload: { alertOpen : true, alertMessage: "Successfully Updated", alertType: "success"  }
                });
                dispatch({
                    type: SET_REDIRECT,
                    payload: { shallRedirect: true, redirectTo: '/user' }
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
                type: SET_USER_STATE,
                payload: { loading: false }
            });
        }
    }
}

export const deleteUser= (id: string | number, token: string): AppThunk => {
    return async (dispatch) => {
        try {
            const payloadResult = await axios.delete(`${API_URL}user/${id}`, {
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

export const exportUserList = (): AppThunk => {
    return async (dispatch, getState) => {
        dispatch({
            type: SET_USER_STATE,
            payload: { loading: true }
        });
        try {
            const { selectedCompanyId } = getState().userState;
            const userRes = await axios.get(`${API_URL}user/export?companyId=${selectedCompanyId ? selectedCompanyId : getState().system.session.userDetails.companyId}`, {
                responseType: 'blob'
            });
            // to use, data is returned as payloadResult
            if (userRes.status === 200 || userRes.status === 204) {
                if (userRes.status === 200 || userRes.status === 204) {
                    const url = window.URL.createObjectURL(new Blob([userRes.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', 'users.xlsx');
                    document.body.appendChild(link);
                    link.click();
                }
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
                type: SET_USER_STATE,
                payload: { loading: false }
            });
        }
    }
}