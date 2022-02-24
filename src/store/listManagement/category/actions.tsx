import {
    CategoryAction,
    CategoryDetails,
    CategoryInput,
    CategoryValidation,
    SetSelectedCompanyFilter,
    SET_CATEGORY_STATE
} from './types';
import { 
    ALERT_STATE
} from '../../alert/types';
import { SET_REDIRECT, SystemState } from '../../system/types';
import { AppThunk } from '../..';
import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;

export const setCategoryState = (data: CategoryInput): CategoryAction => ({
    type : SET_CATEGORY_STATE,
    payload: data
});

export const setCompanyFilter = (data: SetSelectedCompanyFilter): CategoryAction => ({
    type : SET_CATEGORY_STATE,
    payload: data
});

export const setCategoryValidationState = (data: CategoryValidation): AppThunk => {
    return async (dispatch) => {
        dispatch({
            type: SET_CATEGORY_STATE,
            payload: data
        });
        dispatch({
            type: ALERT_STATE,
            payload: {alertOpen: true, alertMessage: "Please Check Required Field", alertType: 'error'}
        });
    }
};

export const getCategoryList = (system: SystemState, companyId: string) : AppThunk => {
    return async (dispatch) => {
        const { token } = system.session
        dispatch({
            type: SET_CATEGORY_STATE,
            payload: { loading: true, categoryList: [] }
        });
        try {
            const payloadResult = await axios.get(`${API_URL}list/category?companyId=${companyId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            // to use, data is returned as payloadResult
            if (payloadResult.status === 200 || payloadResult.status === 204) {
                dispatch({
                    type: SET_CATEGORY_STATE,
                    payload: { categoryList: [...payloadResult.data] }
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
                type: SET_CATEGORY_STATE,
                payload: { loading: false }
            });
        }
    }
}

export const loadCategoryDetails = (id: string, token: string, companyId: string): AppThunk => {
    return async (dispatch) => {
        dispatch({
            type: SET_CATEGORY_STATE,
            payload: { loading: true }
        });
        try {
            const payloadResult = await axios.get(`${API_URL}list/category?id=${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            // to use, data is returned as payloadResult
            if (payloadResult.status === 200 || payloadResult.status === 204) {
                dispatch({
                    type: SET_CATEGORY_STATE,
                    payload: { category: payloadResult.data }
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
                type: SET_CATEGORY_STATE,
                payload: { loading: false }
            });
        }
    }
}

export const saveCategory = ( category: CategoryDetails, system: SystemState, companyId: string ): AppThunk => {
    return async (dispatch) => {
        const { token } = system.session;
        dispatch({
            type: SET_CATEGORY_STATE,
            payload: { loading: true }
        });
        try {
            category.companyId = companyId; 
            const payloadResult = await axios.post(`${API_URL}list/category`, category, {
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
                    payload: { shallRedirect: true, redirectTo: '/category' }
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
                type: SET_CATEGORY_STATE,
                payload: { loading: false }
            });
        }
    }
}

export const updateCategoryDetails = ( data: CategoryDetails, token: string ): AppThunk => {
    return async (dispatch) => {
        dispatch({
            type: SET_CATEGORY_STATE,
            payload: { loading: true }
        });
        try {
            const { isActive, name, companyId } = data; 

            const payloadResult = await axios.put(`${API_URL}list/category/${data.id}`, 
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
                    payload: { shallRedirect: true, redirectTo: '/category' }
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
                type: SET_CATEGORY_STATE,
                payload: { loading: false }
            });
        }
    }
}

export const deleteCategory= (id: string | number, token: string, companyId: string): AppThunk => {
    return async (dispatch) => {
        try {
            const payloadResult = await axios.delete(`${API_URL}list/category/${id}`, {
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