import {
    SET_MAKE_STATE, 
    MakeAction,
    MakeDetails,
    MakeInput,
    MakeValidation,
    SetMakeSelectedCompanyFilter
} from './types'
import { 
    ALERT_STATE
} from '../../alert/types';
import { SET_REDIRECT, SystemState } from '../../system/types';
import { AppThunk } from '../..';
import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;


export const setMakeState = (data: MakeInput): MakeAction => ({
    type : SET_MAKE_STATE,
    payload: data
});

export const setMakeCompanyFilter = (data: SetMakeSelectedCompanyFilter): MakeAction => ({
    type : SET_MAKE_STATE,
    payload: data
});

export const setMakeValidationState = (data: MakeValidation): AppThunk => {
    return async (dispatch) => {
        dispatch({
            type: SET_MAKE_STATE,
            payload: data
        })
        dispatch({
            type: ALERT_STATE,
            payload: {alertOpen: true, alertMessage: "Please Check Required Field", alertType: 'error'}
        });
    }
};

export const getMakeList = (system: SystemState, companyId: string): AppThunk => {
    return async (dispatch) => {
        const { token } = system.session;
        dispatch({
            type: SET_MAKE_STATE,
            payload: { loading: true, makeList: [] }
        });
        try {
            const payloadResult = await axios.get(`${API_URL}list/make?companyId=${companyId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            // to use, data is returned as payloadResult
            if (payloadResult.status === 200 || payloadResult.status === 204) {
                dispatch({
                    type: SET_MAKE_STATE,
                    payload: { makeList: [...payloadResult.data] }
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
                type: SET_MAKE_STATE,
                payload: { loading: false }
            });
        }
    }
}

export const loadMakeDetails = (id: string, token: string, companyId: string): AppThunk => {
    return async (dispatch) => {
        dispatch({
            type: SET_MAKE_STATE,
            payload: { loading: true }
        });
        try {
            const payloadResult = await axios.get(`${API_URL}list/make?id=${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            // to use, data is returned as payloadResult
            if (payloadResult.status === 200 || payloadResult.status === 204) {
                dispatch({
                    type: SET_MAKE_STATE,
                    payload: { make: payloadResult.data }
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
                type: SET_MAKE_STATE,
                payload: { loading: false }
            });
        }
    }
}

export const saveMake = ( make: MakeDetails, system: SystemState, companyId: string ): AppThunk => {
    return async (dispatch) => {
        const { token } = system.session;
        dispatch({
            type: SET_MAKE_STATE,
            payload: { loading: true }
        });
        try {
            make.companyId = companyId; 
            const payloadResult = await axios.post(`${API_URL}list/make`, make, {
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
                    payload: { shallRedirect: true, redirectTo: '/make' }
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
                type: SET_MAKE_STATE,
                payload: { loading: false }
            });
        }
    }
}

export const updateMakeDetails = ( data: MakeDetails, token: string ): AppThunk => {
    return async (dispatch) => {
        dispatch({
            type: SET_MAKE_STATE,
            payload: { loading: true }
        });
        try {
            const { isActive, name, companyId } = data; 

            const payloadResult = await axios.put(`${API_URL}list/make/${data.id}`, 
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
                    payload: { shallRedirect: true, redirectTo: '/make' }
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
                type: SET_MAKE_STATE,
                payload: { loading: false }
            });
        }
    }
}


export const deleteMake = (id: string | number, token: string, companyId: string): AppThunk => {
    return async (dispatch) => {
        try {
            const payloadResult = await axios.delete(`${API_URL}list/make/${id}`, {
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