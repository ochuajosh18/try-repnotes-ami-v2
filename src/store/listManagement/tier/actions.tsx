import {
    SetTierSelectedCompanyFilter,
    SET_TIER_STATE, 
    TierAction,
    TierDetails,
    TierInput,
    TierValidation
} from './types'
import { 
    ALERT_STATE
} from '../../alert/types';
import { SET_REDIRECT, SystemState } from '../../system/types';
import { AppThunk } from '../..';
import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;

export const setTierState = (data: TierInput): TierAction => ({
    type : SET_TIER_STATE,
    payload: data
});

export const setTierCompanyFilter = (data: SetTierSelectedCompanyFilter): TierAction => ({
    type : SET_TIER_STATE,
    payload: data
});

export const setTierValidationState = (data: TierValidation): AppThunk => {
    return async (dispatch) => {
        dispatch({
            type: SET_TIER_STATE,
            payload: data
        })
        dispatch({
            type: ALERT_STATE,
            payload: {alertOpen: true, alertMessage: "Please Check Required Field", alertType: 'error'}
        });
    }
};

export const getTierList = (system: SystemState, companyId: string): AppThunk => {
    return async (dispatch) => {
        const { token } = system.session
        dispatch({
            type: SET_TIER_STATE,
            payload: { loading: true, tierList: [] }
        });
        try {
            const payloadResult = await axios.get(`${API_URL}list/tier?companyId=${companyId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            // to use, data is returned as payloadResult
            if (payloadResult.status === 200 || payloadResult.status === 204) {
                dispatch({
                    type: SET_TIER_STATE,
                    payload: { tierList: [...payloadResult.data] }
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
                type: SET_TIER_STATE,
                payload: { loading: false }
            });
        }
    }
}

export const loadTierDetails = (id: string, token: string, companyId: string): AppThunk => {
    return async (dispatch) => {
        dispatch({
            type: SET_TIER_STATE,
            payload: { loading: true }
        });
        try {
            const payloadResult = await axios.get(`${API_URL}list/tier?id=${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            // to use, data is returned as payloadResult
            if (payloadResult.status === 200 || payloadResult.status === 204) {
                dispatch({
                    type: SET_TIER_STATE,
                    payload: { tier: payloadResult.data }
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
                type: SET_TIER_STATE,
                payload: { loading: false }
            });
        }
    }
}

export const saveTier = ( tier: TierDetails,system: SystemState, companyId: string): AppThunk => {
    return async (dispatch) => {
        const { token } = system.session;
        dispatch({
            type: SET_TIER_STATE,
            payload: { loading: true }
        });
        try {
            tier.companyId = companyId; 
            const payloadResult = await axios.post(`${API_URL}list/tier`, tier, {
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
                    payload: { shallRedirect: true, redirectTo: '/tier' }
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
                type: SET_TIER_STATE,
                payload: { loading: false }
            });
        }
    }
}

export const updateTierDetails = ( data: TierDetails, token: string ): AppThunk => {
    return async (dispatch) => {
        dispatch({
            type: SET_TIER_STATE,
            payload: { loading: true }
        });
        try {
            const { isActive, name, companyId } = data; 

            const payloadResult = await axios.put(`${API_URL}list/tier/${data.id}`, 
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
                    payload: { shallRedirect: true, redirectTo: '/tier' }
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
                type: SET_TIER_STATE,
                payload: { loading: false }
            });
        }
    }
}

export const deleteTier = (id: string | number, token: string, companyId: string): AppThunk => {
    return async (dispatch) => {
        try {
            const payloadResult = await axios.delete(`${API_URL}list/tier/${id}`, {
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