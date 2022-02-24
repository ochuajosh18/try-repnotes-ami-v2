import {
    SetPromotionSelectedCompanyFilter,
    PromotionDetails,
    PromotionInput,
    PromotionAction,
    PromotionValidation,
    SET_PROMOTION_STATE,
    Media
} from './types'
import { 
    ALERT_STATE
} from '../../alert/types';
import { SET_REDIRECT, SystemState } from '../../system/types';
import { AppThunk } from '../..';
import { uploadMedia } from '../../../util/upload';
import axios from 'axios';
import filter from 'lodash/filter'
import map from 'lodash/map';
const API_URL = process.env.REACT_APP_API_URL;


export const setPromotionState = (data: PromotionInput): PromotionAction => ({
    type : SET_PROMOTION_STATE,
    payload: data
});

export const setPromotionCompanyFilter = (data: SetPromotionSelectedCompanyFilter): PromotionAction => ({
    type : SET_PROMOTION_STATE,
    payload: data
});

export const setPromotionValidationState = (data: PromotionValidation): AppThunk => {
    return async (dispatch) => {
        dispatch({
            type: SET_PROMOTION_STATE,
            payload: data
        })
        dispatch({
            type: ALERT_STATE,
            payload: {alertOpen: true, alertMessage: "Please Check Required Field", alertType: 'error'}
        });
    }
};

export const setStartDateFilter= (promotion: PromotionDetails, startDate: string): PromotionAction => ({
    type: SET_PROMOTION_STATE,
    payload: { promotion: { ...promotion, startDate: startDate } }
});

export const setEndDateFilter= (promotion: PromotionDetails, endDate: string): PromotionAction => ({
    type: SET_PROMOTION_STATE,
    payload: { promotion: { ...promotion, endDate: endDate } }
});


export const getPromotionList = (system: SystemState, companyId: string): AppThunk => {
    return async (dispatch) => {
        const { token } = system.session
        dispatch({
            type: SET_PROMOTION_STATE,
            payload: { loading: true, promotionList: [] }
        });
        try {
            const payloadResult = await axios.get(`${API_URL}promotion?companyId=${companyId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            // to use, data is returned as payloadResult
            if (payloadResult.status === 200 || payloadResult.status === 204) {
                dispatch({
                    type: SET_PROMOTION_STATE,
                    payload: { promotionList: [...payloadResult.data] }
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
                type: SET_PROMOTION_STATE,
                payload: { loading: false }
            });
        }
    }
}

export const loadPromotionDetails = (id: string, token: string): AppThunk => {
    return async (dispatch) => {
        dispatch({
            type: SET_PROMOTION_STATE,
            payload: { loading: true }
        });
        try {
            const payloadResult = await axios.get(`${API_URL}promotion?id=${id}`);
            // to use, data is returned as payloadResult
            if (payloadResult.status === 200 || payloadResult.status === 204) {
                dispatch({
                    type: SET_PROMOTION_STATE,
                    payload: { promotion: {...payloadResult.data, product: map(payloadResult.data.product, (p) => JSON.stringify(p))} }
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
                type: SET_PROMOTION_STATE,
                payload: { loading: false }
            });
        }
    }
}

export const deletePromotionImage= (promotion: PromotionDetails | undefined): PromotionAction => ({
    type: SET_PROMOTION_STATE,
    payload: { promotion: { ...promotion, image: [{ name: '', path: '', size: 0, type: ''}] } }
});

export const deletePromotionVideo= (promotion: PromotionDetails | undefined): PromotionAction => ({
    type: SET_PROMOTION_STATE,
    payload: { promotion: { ...promotion, video: [{ name: '', path: '', size: 0, type: ''}] } }
});

export const savePromotion = ( data: PromotionDetails, system: SystemState, companyId: string ): AppThunk => {
    return async (dispatch) => {
        dispatch({
            type: SET_PROMOTION_STATE,
            payload: { loading: true }
        });
        try {
            data.companyId = companyId;
            data.price = parseInt(data.price as string)
            for (const key of Object.keys(data)) {
                if (['image', 'video'].includes(key)) {
                    let filesToUpload: Array<File> = [];
                    for (const m in data[key] as Array<Media>) {
                        const me = (data[key] as Array<Media>)[m] as Media;
                        if (me.file) { 
                            filesToUpload = [...filesToUpload, me.file];
                        }
                    }
                    
                    data = { ...data, [key]: [ ...filter(data[key] as Array<Media>, (u) => !u.file), ...await uploadMedia(filesToUpload, 'promotion')]} as typeof data;
                }
            }
            
            const payloadResult = await axios.post(`${API_URL}promotion`, { 
                ...data, 
                price: parseInt(data.price as string),
                product: map(data.product, (p) => JSON.parse(p)), 
                companyId
            });

            if (payloadResult.status === 200 || payloadResult.status === 204) {
                dispatch({
                    type: ALERT_STATE,
                    payload: { alertOpen : true, alertMessage: "Successfully Saved", alertType: "success"  }
                });
                dispatch({
                    type: SET_REDIRECT,
                    payload: { shallRedirect: true, redirectTo: '/promotion' }
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
                type: SET_PROMOTION_STATE,
                payload: { loading: false }
            });
        }
    }
}

export const updatePromotion = ( data: PromotionDetails, token: string ): AppThunk => {
    return async (dispatch) => {
        dispatch({
            type: SET_PROMOTION_STATE,
            payload: { loading: true }
        });
        try {
            const { name, description, mechanics, price, startDate, endDate, product, image, video, isActive } = data;
            let updateData: Partial<typeof data> = { name, description, mechanics, price, startDate, endDate, product, image, video, isActive };
            for (const key of Object.keys(updateData)) {
                if (['video', 'image'].includes(key)) {
                    let filesToUpload: Array<File> = [];
                    for (const m in updateData[key] as Array<Media>) {
                        const me = (updateData[key] as Array<Media>)[m] as Media;
                        if (me.file) { 
                            filesToUpload = [...filesToUpload, me.file];
                        }
                    }
                    
                    updateData = { ...updateData, [key]: [ ...filter(updateData[key] as Array<Media>, (u) => !u.file), ...await uploadMedia(filesToUpload, 'promotion')]} as typeof updateData;
                }
            }
            
            const payloadResult = await axios.put(`${API_URL}promotion/${data.id}`, {
                ...updateData,
                price: parseInt(data.price as string),
                product: map(data.product, (p) => JSON.parse(p))
            });
            
            if(payloadResult.status === 200 || payloadResult.status === 204) {
                dispatch({
                    type: ALERT_STATE,
                    payload: { alertOpen : true, alertMessage: "Successfully Updated", alertType: "success"  }
                });
                dispatch({
                    type: SET_REDIRECT,
                    payload: { shallRedirect: true, redirectTo: '/promotion' }
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
                type: SET_PROMOTION_STATE,
                payload: { loading: false }
            });
        }
    }
}


export const deletePromotion= (id: string | number, token: string): AppThunk => {
    return async (dispatch) => {
        try {
            const payloadResult = await axios.delete(`${API_URL}promotion/${id}`);
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