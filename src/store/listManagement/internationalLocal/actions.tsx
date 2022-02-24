import {
    SET_INTERNATIONAL_LOCAL_STATE, 
    InternationalLocalAction,
    InternationalLocalDetails,
    InternationalLocalInput,
    InternationalLocalValidation,
    SetILSelectedCompanyFilter
} from './types'
import { 
    ALERT_STATE
} from '../../alert/types';
import { SET_REDIRECT, SystemState } from '../../system/types';
import { AppThunk } from '../..';
import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;


export const setInternationalLocalState = (data: InternationalLocalInput): InternationalLocalAction => ({
    type : SET_INTERNATIONAL_LOCAL_STATE,
    payload: data
});

export const setILCompanyFilter = (data: SetILSelectedCompanyFilter): InternationalLocalAction => ({
    type : SET_INTERNATIONAL_LOCAL_STATE,
    payload: data
});

export const setInternationalLocalValidationState = (data: InternationalLocalValidation): AppThunk => {
    return async (dispatch) => {
        dispatch({
            type: SET_INTERNATIONAL_LOCAL_STATE,
            payload: data
        })
        dispatch({
            type: ALERT_STATE,
            payload: {alertOpen: true, alertMessage: "Please Check Required Field", alertType: 'error'}
        });
    }
};

export const getInternationalLocalList = (system: SystemState, companyId: string): AppThunk => {
    return async (dispatch) => {
        const { token } = system.session
        dispatch({
            type: SET_INTERNATIONAL_LOCAL_STATE,
            payload: { loading: true, internationalLocalList: [] }
        });
        try {
            const payloadResult = await axios.get(`${API_URL}list/international-local?companyId=${companyId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            // to use, data is returned as payloadResult
            if (payloadResult.status === 200 || payloadResult.status === 204) {
                dispatch({
                    type: SET_INTERNATIONAL_LOCAL_STATE,
                    payload: { internationalLocalList: [...payloadResult.data] }
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
                type: SET_INTERNATIONAL_LOCAL_STATE,
                payload: { loading: false }
            });
        }
    }
}

export const loadInternationalLocalDetails = (id: string, token: string, companyId: string): AppThunk => {
    return async (dispatch) => {
        dispatch({
            type: SET_INTERNATIONAL_LOCAL_STATE,
            payload: { loading: true }
        });
        try {
            const payloadResult = await axios.get(`${API_URL}list/international-local?id=${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            // to use, data is returned as payloadResult
            if (payloadResult.status === 200 || payloadResult.status === 204) {
                dispatch({
                    type: SET_INTERNATIONAL_LOCAL_STATE,
                    payload: { internationalLocal: payloadResult.data }
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
                type: SET_INTERNATIONAL_LOCAL_STATE,
                payload: { loading: false }
            });
        }
    }
}

export const saveInternationalLocal = ( internationalLocal: InternationalLocalDetails,  system: SystemState, companyId: string): AppThunk => {
    return async (dispatch) => {
        const { token } = system.session;
        dispatch({
            type: SET_INTERNATIONAL_LOCAL_STATE,
            payload: { loading: true }
        });
        try {
            internationalLocal.companyId = companyId;
            const payloadResult = await axios.post(`${API_URL}list/international-local`, internationalLocal, {
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
                    payload: { shallRedirect: true, redirectTo: '/international-local' }
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
                type: SET_INTERNATIONAL_LOCAL_STATE,
                payload: { loading: false }
            });
        }
    }
}

export const updateInternationalLocalDetails = ( data: InternationalLocalDetails, token: string ): AppThunk => {
    return async (dispatch) => {
        dispatch({
            type: SET_INTERNATIONAL_LOCAL_STATE,
            payload: { loading: true }
        });
        try {
            const { isActive, name, companyId } = data; 

            const payloadResult = await axios.put(`${API_URL}list/international-local/${data.id}`, 
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
                    payload: { shallRedirect: true, redirectTo: '/international-local' }
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
                type: SET_INTERNATIONAL_LOCAL_STATE,
                payload: { loading: false }
            });
        }
    }
}

export const deleteInternationalLocal = (id: string | number, token: string, companyId: string): AppThunk => {
    return async (dispatch) => {
        try {
            const payloadResult = await axios.delete(`${API_URL}list/international-local/${id}`, {
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