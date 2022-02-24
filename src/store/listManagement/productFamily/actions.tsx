import {
    ProductFamilyAction,
    ProductFamilyDetails,
    ProductFamilyInput,
    ProductFamilyValidation,
    SetPFSelectedCompanyFilter,
    SET_PRODUCT_FAMILY_STATE
} from './types'
import { 
    ALERT_STATE
} from '../../alert/types';
import { SET_REDIRECT, SystemState } from '../../system/types';
import { AppThunk } from '../..';
import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;


export const setProductFamilyState = (data: ProductFamilyInput): ProductFamilyAction => ({
    type : SET_PRODUCT_FAMILY_STATE,
    payload: data
});

export const setPFCompanyFilter = (data: SetPFSelectedCompanyFilter): ProductFamilyAction => ({
    type : SET_PRODUCT_FAMILY_STATE,
    payload: data
});

export const setProductFamilyValidationState = (data: ProductFamilyValidation): AppThunk => {
    return async (dispatch) => {
        dispatch({
            type: SET_PRODUCT_FAMILY_STATE,
            payload: data
        })
        dispatch({
            type: ALERT_STATE,
            payload: {alertOpen: true, alertMessage: "Please Check Required Field", alertType: 'error'}
        });
    }
};

export const getProductFamilyList = (system: SystemState, companyId: string): AppThunk => {
    return async (dispatch) => {
        const { token } = system.session
        dispatch({
            type: SET_PRODUCT_FAMILY_STATE,
            payload: { loading: true, productFamilyList: [] }
        });
        try {
            const payloadResult = await axios.get(`${API_URL}list/product-family?companyId=${companyId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            // to use, data is returned as payloadResult
            if (payloadResult.status === 200 || payloadResult.status === 204) {
                dispatch({
                    type: SET_PRODUCT_FAMILY_STATE,
                    payload: { productFamilyList: [...payloadResult.data] }
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
                type: SET_PRODUCT_FAMILY_STATE,
                payload: { loading: false }
            });
        }
    }
}

export const loadProductFamilyDetails = (id: string, token: string, companyId: string): AppThunk => {
    return async (dispatch) => {
        dispatch({
            type: SET_PRODUCT_FAMILY_STATE,
            payload: { loading: true }
        });
        try {
            const payloadResult = await axios.get(`${API_URL}list/product-family?id=${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            // to use, data is returned as payloadResult
            if (payloadResult.status === 200 || payloadResult.status === 204) {
                dispatch({
                    type: SET_PRODUCT_FAMILY_STATE,
                    payload: { productFamily: payloadResult.data }
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
                type: SET_PRODUCT_FAMILY_STATE,
                payload: { loading: false }
            });
        }
    }
}

export const saveProductFamily = ( productFamily: ProductFamilyDetails, system: SystemState, companyId: string): AppThunk => {
    return async (dispatch) => {
        const { token } = system.session;
        dispatch({
            type: SET_PRODUCT_FAMILY_STATE,
            payload: { loading: true }
        });
        try {
            productFamily.companyId = companyId; 
            const payloadResult = await axios.post(`${API_URL}list/product-family`, productFamily, {
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
                    payload: { shallRedirect: true, redirectTo: '/product-family' }
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
                type: SET_PRODUCT_FAMILY_STATE,
                payload: { loading: false }
            });
        }
    }
}

export const updateProductFamilyDetails = ( data: ProductFamilyDetails, token: string ): AppThunk => {
    return async (dispatch) => {
        dispatch({
            type: SET_PRODUCT_FAMILY_STATE,
            payload: { loading: true }
        });
        try {
            const { isActive, name, companyId } = data; 

            const payloadResult = await axios.put(`${API_URL}list/product-family/${data.id}`, 
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
                    payload: { shallRedirect: true, redirectTo: '/product-family' }
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
                type: SET_PRODUCT_FAMILY_STATE,
                payload: { loading: false }
            });
        }
    }
}


export const deleteProductFamily = (id: string | number, token: string, companyId: string): AppThunk => {
    return async (dispatch) => {
        try {
            const payloadResult = await axios.delete(`${API_URL}list/product-family/${id}`, {
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