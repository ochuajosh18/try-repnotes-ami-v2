import {
    SET_CUSTOMER_TYPE_STATE, 
    CustomerTypeAction,
    CustomerTypeDetails,
    CustomerTypeInput,
    CustomerTypeValidation,
    SetSelectedCompanyFilter
} from './types'
import { 
    ALERT_STATE
} from '../../alert/types';
import { SET_REDIRECT, SystemState } from '../../system/types';
import { AppThunk } from '../..';
import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;


export const setCustomerTypeState = (data: CustomerTypeInput): CustomerTypeAction => ({
    type : SET_CUSTOMER_TYPE_STATE,
    payload: data
});

export const setCompanyFilter = (data: SetSelectedCompanyFilter): CustomerTypeAction => ({
    type : SET_CUSTOMER_TYPE_STATE,
    payload: data
});

export const setCustomerTypeValidationState = (data: CustomerTypeValidation): AppThunk => {
    return async (dispatch) => {
        dispatch({
            type: SET_CUSTOMER_TYPE_STATE,
            payload: data
        })
        dispatch({
            type: ALERT_STATE,
            payload: {alertOpen: true, alertMessage: "Please Check Required Field", alertType: 'error'}
        });
    }
};

export const getCustomerTypeList = (system: SystemState, companyId: string): AppThunk => {
    return async (dispatch) => {
        const { token } = system.session;
        dispatch({
            type: SET_CUSTOMER_TYPE_STATE,
            payload: { loading: true, customerTypeList: [] }
        });
        try {
            const payloadResult = await axios.get(`${API_URL}list/customerType?companyId=${companyId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            // to use, data is returned as payloadResult
            if (payloadResult.status === 200 || payloadResult.status === 204) {
                dispatch({
                    type: SET_CUSTOMER_TYPE_STATE,
                    payload: { customerTypeList: [...payloadResult.data] }
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
                type: SET_CUSTOMER_TYPE_STATE,
                payload: { loading: false }
            });
        }
    }
}

export const loadCustomerTypeDetails = (id: string, token: string, companyId: string): AppThunk => {
    return async (dispatch) => {
        dispatch({
            type: SET_CUSTOMER_TYPE_STATE,
            payload: { loading: true }
        });
        try {
            const payloadResult = await axios.get(`${API_URL}list/customerType?id=${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            // to use, data is returned as payloadResult
            if (payloadResult.status === 200 || payloadResult.status === 204) {
                dispatch({
                    type: SET_CUSTOMER_TYPE_STATE,
                    payload: { customerType: payloadResult.data }
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
                type: SET_CUSTOMER_TYPE_STATE,
                payload: { loading: false }
            });
        }
    }
}

export const saveCustomerType = ( customerType: CustomerTypeDetails, system: SystemState, companyId: string): AppThunk => {
    return async (dispatch) => {
        const { token } = system.session;
        dispatch({
            type: SET_CUSTOMER_TYPE_STATE,
            payload: { loading: true }
        });
        try {
            customerType.companyId = companyId; 
            const payloadResult = await axios.post(`${API_URL}list/customerType`, customerType, {
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
                    payload: { shallRedirect: true, redirectTo: '/customer-type' }
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
                type: SET_CUSTOMER_TYPE_STATE,
                payload: { loading: false }
            });
        }
    }
}

export const updateCustomerTypeDetails = ( data: CustomerTypeDetails, token: string ): AppThunk => {
    return async (dispatch) => {
        dispatch({
            type: SET_CUSTOMER_TYPE_STATE,
            payload: { loading: true }
        });
        try {
            const { isActive, name, companyId } = data; 

            const payloadResult = await axios.put(`${API_URL}list/customerType/${data.id}`, 
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
                    payload: { shallRedirect: true, redirectTo: '/customer-type' }
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
                type: SET_CUSTOMER_TYPE_STATE,
                payload: { loading: false }
            });
        }
    }
}

export const deleteCustomerType = (id: string | number, token: string, companyId: string): AppThunk => {
    return async (dispatch) => {
        try {
            const payloadResult = await axios.delete(`${API_URL}list/customerType/${id}`, {
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