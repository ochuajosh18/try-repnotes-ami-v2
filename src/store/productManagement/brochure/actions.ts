import {
    BrochureAction,
    BrochureDetails,
    BrochureInput,
    BrochureValidation,
    SetBrochureSelectedCompanyFilter,
    Media,
    SET_BROCHURE_STATE
} from './types'
import { 
    ALERT_STATE
} from '../../alert/types';
import { SET_REDIRECT, SystemState } from '../../system/types';
import { AppThunk } from '../..';
import axios from 'axios';
// import filter from 'lodash/filter';
import { uploadMedia } from '../../../util/upload';
const API_URL = process.env.REACT_APP_API_URL;


export const setBrochureState = (data: BrochureInput): BrochureAction => ({
    type : SET_BROCHURE_STATE,
    payload: data
});

export const setBrochureCompanyFilter = (data: SetBrochureSelectedCompanyFilter): BrochureAction => ({
    type : SET_BROCHURE_STATE,
    payload: data
});

export const setBrochureValidationState = (data: BrochureValidation): AppThunk => {
    return async (dispatch) => {
        dispatch({
            type: SET_BROCHURE_STATE,
            payload: data
        })
        dispatch({
            type: ALERT_STATE,
            payload: {alertOpen: true, alertMessage: "Please Check Required Field", alertType: 'error'}
        });
    }
};

export const getBrochureList = (system: SystemState, companyId: string): AppThunk => {
    return async (dispatch) => {
        const { token } = system.session
        dispatch({
            type: SET_BROCHURE_STATE,
            payload: { loading: true, brochureList: [] }
        });
        try {
            const payloadResult = await axios.get(`${API_URL}brochure?companyId=${companyId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            // to use, data is returned as payloadResult
            if (payloadResult.status === 200 || payloadResult.status === 204) {
                dispatch({
                    type: SET_BROCHURE_STATE,
                    payload: { brochureList: [...payloadResult.data] }
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
                type: SET_BROCHURE_STATE,
                payload: { loading: false }
            });
        }
    }
}

export const loadBrochureDetails = (id: string, token: string): AppThunk => {
    return async (dispatch) => {
        dispatch({
            type: SET_BROCHURE_STATE,
            payload: { loading: true }
        });
        try {
            const payloadResult = await axios.get(`${API_URL}brochure?id=${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            // to use, data is returned as payloadResult
            if (payloadResult.status === 200 || payloadResult.status === 204) {
                dispatch({
                    type: SET_BROCHURE_STATE,
                    payload: { brochure: payloadResult.data }
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
                type: SET_BROCHURE_STATE,
                payload: { loading: false }
            });
        }
    }
}

export const deleteBrochureMedia= (brochure: BrochureDetails | undefined): BrochureAction => ({
    type: SET_BROCHURE_STATE,
    payload: { brochure: { ...brochure, media: { name: '', path: '', size: 0, type: ''} } }
});

export const saveBrochure = ( data: BrochureDetails, system: SystemState, companyId: string ): AppThunk => {
    return async (dispatch) => {
        dispatch({
            type: SET_BROCHURE_STATE,
            payload: { loading: true }
        });
        try {
            if(data.media.name !== ''){
                data.companyId = companyId; 
                for (const key of Object.keys(data)) {
                    if (['media'].includes(key)) {
                        let filesToUpload: Array<File> = [];
                        const me = data[key] as Array<Media>;
                        if (me[0].file) { 
                            filesToUpload = [...filesToUpload, me[0].file];
                            const uploaded = await uploadMedia([me[0].file], 'product');
                            data = { ...data, [key]: uploaded } as typeof data;
                        }
                    }
                }
                const payloadResult = await axios.post(`${API_URL}brochure`, data);
                if (payloadResult.status === 200 || payloadResult.status === 204) {
                    dispatch({
                        type: ALERT_STATE,
                        payload: { alertOpen : true, alertMessage: "Successfully Saved", alertType: "success"  }
                    });
                    dispatch({
                        type: SET_REDIRECT,
                        payload: { shallRedirect: true, redirectTo: '/brochure' }
                    });
                }
            }else {
                dispatch({
                    type: ALERT_STATE,
                    payload: {alertOpen: true, alertMessage: 'Please Upload Media', alertType: 'error'}
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
                type: SET_BROCHURE_STATE,
                payload: { loading: false }
            });
        }
    }
}

export const updateBrochure = ( data: BrochureDetails, token: string ): AppThunk => {
    return async (dispatch) => {
        dispatch({
            type: SET_BROCHURE_STATE,
            payload: { loading: true }
        });
        try {
            const { title, productFamilyId, product, media, isActive, companyId } = data; 
            let updateData: typeof data = { title, productFamilyId, product, media, isActive, companyId };
            for (const key of Object.keys(updateData)) {
                if (['media'].includes(key)) {
                    let filesToUpload: Array<File> = [];
                    const me = (updateData[key] as unknown) as Array<Media>;
                    if (me[0].file) { 
                        filesToUpload = [...filesToUpload, me[0].file];
                        const uploaded = await uploadMedia([me[0].file], 'product');
                        updateData = { ...updateData, [key]: uploaded } as typeof updateData;
                    }
                }
            }
            const payloadResult = await axios.put(`${API_URL}brochure/${data.id}`, updateData);
            
            if(payloadResult.status === 200 || payloadResult.status === 204) {
                dispatch({
                    type: ALERT_STATE,
                    payload: { alertOpen : true, alertMessage: "Successfully Updated", alertType: "success"  }
                });
                dispatch({
                    type: SET_REDIRECT,
                    payload: { shallRedirect: true, redirectTo: '/brochure' }
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
                type: SET_BROCHURE_STATE,
                payload: { loading: false }
            });
        }
    }
}


export const deleteBrochure= (id: string | number, token: string): AppThunk => {
    return async (dispatch) => {
        try {
            const payloadResult = await axios.delete(`${API_URL}brochure/${id}`, {
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