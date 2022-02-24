import {
    SET_GOVERNMENT_PRIVATE_STATE, 
    GovernmentPrivateAction,
    GovernmentPrivateInput,
    GovernmentPrivateValidation,
    GovernmentPrivateDetails,
    SetSelectedGovernmentPrivateCompanyFilter
} from './types'
import { 
    ALERT_STATE
} from '../../alert/types';
import { 
    SET_REDIRECT, 
    SystemState 
} from '../../system/types';
import { AppThunk } from '../..';
import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;


export const setGovernmentPrivateState = (data: GovernmentPrivateInput): GovernmentPrivateAction => ({
    type : SET_GOVERNMENT_PRIVATE_STATE,
    payload: data
});

export const setCompanyFilter = (data: SetSelectedGovernmentPrivateCompanyFilter): GovernmentPrivateAction => ({
    type : SET_GOVERNMENT_PRIVATE_STATE,
    payload: data
});

export const setGovernmentPrivateValidationState = (data: GovernmentPrivateValidation): AppThunk => {
    return async (dispatch) => {
        dispatch({
            type: SET_GOVERNMENT_PRIVATE_STATE,
            payload: data
        })
        dispatch({
            type: ALERT_STATE,
            payload: {alertOpen: true, alertMessage: "Please Check Required Field", alertType: 'error'}
        });
    }
};

export const getGovernmentPrivateList = (system: SystemState, companyId: string): AppThunk => {
    return async (dispatch) => {
        const { token } = system.session;
        dispatch({
            type: SET_GOVERNMENT_PRIVATE_STATE,
            payload: { loading: true, governmentPrivateList: [] }
        });
        try {
            const payloadResult = await axios.get(`${API_URL}list/government-private?companyId=${companyId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            // to use, data is returned as payloadResult
            if (payloadResult.status === 200 || payloadResult.status === 204) {
                dispatch({
                    type: SET_GOVERNMENT_PRIVATE_STATE,
                    payload: { governmentPrivateList: [...payloadResult.data] }
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
                type: SET_GOVERNMENT_PRIVATE_STATE,
                payload: { loading: false }
            });
        }
    }
}

export const loadGovernmentPrivateDetails = (id: string, token: string, companyId: string): AppThunk => {
    return async (dispatch) => {
        dispatch({
            type: SET_GOVERNMENT_PRIVATE_STATE,
            payload: { loading: true }
        });
        try {
            const payloadResult = await axios.get(`${API_URL}list/government-private?id=${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            // to use, data is returned as payloadResult
            if (payloadResult.status === 200 || payloadResult.status === 204) {
                dispatch({
                    type: SET_GOVERNMENT_PRIVATE_STATE,
                    payload: { governmentPrivate: payloadResult.data }
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
                type: SET_GOVERNMENT_PRIVATE_STATE,
                payload: { loading: false }
            });
        }
    }
}

export const saveGovernmentPrivate = ( governmentPrivate: GovernmentPrivateDetails, system: SystemState, companyId: string ): AppThunk => {
    return async (dispatch) => {
        const { token } = system.session;
        dispatch({
            type: SET_GOVERNMENT_PRIVATE_STATE,
            payload: { loading: true }
        });
        try {
            governmentPrivate.companyId = companyId;
            const payloadResult = await axios.post(`${API_URL}list/government-private`, governmentPrivate, {
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
                    payload: { shallRedirect: true, redirectTo: '/government-private' }
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
                type: SET_GOVERNMENT_PRIVATE_STATE,
                payload: { loading: false }
            });
        }
    }
}

export const updateGovernmentPrivateDetails = ( data: GovernmentPrivateDetails, token: string ): AppThunk => {
    return async (dispatch) => {
        dispatch({
            type: SET_GOVERNMENT_PRIVATE_STATE,
            payload: { loading: true }
        });
        try {
            const { isActive, name, companyId } = data; 

            const payloadResult = await axios.put(`${API_URL}list/government-private/${data.id}`, 
                {
                    isActive, name, companyId
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
                    payload: { shallRedirect: true, redirectTo: '/government-private' }
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
                type: SET_GOVERNMENT_PRIVATE_STATE,
                payload: { loading: false }
            });
        }
    }
}

export const deleteGovernmentPrivate = (id: string | number, token: string, companyId: string): AppThunk => {
    return async (dispatch) => {
        try {
            const payloadResult = await axios.delete(`${API_URL}list/government-private/${id}`, {
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