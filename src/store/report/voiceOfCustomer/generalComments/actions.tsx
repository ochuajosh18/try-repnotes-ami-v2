import {
    GeneralCommentsAction,
    SET_GENERAL_COMMENTS_STATE,
    DynamicGeneralCommentsInputInterface,
    DynamicGeneralCommentsType
} from './types';
import { 
    ALERT_STATE
} from '../../../alert/types';
import { AppThunk } from '../../..';
import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;

export const setGeneralCommentsState = (state: DynamicGeneralCommentsInputInterface<DynamicGeneralCommentsType>): GeneralCommentsAction => ({
    type: SET_GENERAL_COMMENTS_STATE,
    payload: state
});

export const resetFilter = (state: Array<string>): AppThunk => (dispatch) => {
    state.forEach(filter => {
        dispatch({
            type: SET_GENERAL_COMMENTS_STATE,
            payload: { [filter]: '' }
        });
    });
};

export const getGeneralComments = () : AppThunk => {
    return async (dispatch, getState) => {
        const { userDetails } = getState().system.session;
        const { salesPersonDocId, province, customerTypeId, industryId, selectedCompanyId, customerId } = getState().generalCommentsState;
        dispatch({
            type: SET_GENERAL_COMMENTS_STATE,
            payload: { loading: true, generalComments: {} }
        });
        try {
            const salespersonFilter = (userDetails.role as string).toLowerCase() === 'sales engineer' ? `${userDetails.id}` : salesPersonDocId;
            const generalCommentsRes = await axios.get(`${API_URL}report/voice-of-customer/general-comments?companyId=${selectedCompanyId}${!salespersonFilter? '' : `&salesPersonDocId=${salespersonFilter}`}${!industryId? '':`&industryId=${industryId}`}${!customerTypeId? '':`&customerTypeId=${customerTypeId}`}${!province? '':`&province=${province}`}${!customerId? '':`&customerId=${customerId}`}`);
            // to use, data is returned as payloadResult
            if (generalCommentsRes.status === 200 || generalCommentsRes.status === 204) {
                const { report, status } = generalCommentsRes.data;
                dispatch({
                    type: SET_GENERAL_COMMENTS_STATE,
                    payload: { generalComments: status, report }
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
                type: SET_GENERAL_COMMENTS_STATE,
                payload: { loading: false }
            });
        }
    }
}


export const exportGeneralComments = () : AppThunk => {
    return async (dispatch, getState) => {
        const { userDetails } = getState().system.session;
        const { salesPersonDocId, province, customerTypeId, industryId, selectedCompanyId, customerId } = getState().generalCommentsState;
        dispatch({
            type: SET_GENERAL_COMMENTS_STATE,
            payload: { loading: true }
        });
        try {
            const salespersonFilter = (userDetails.role as string).toLowerCase() === 'sales engineer' ? `${userDetails.id}` : salesPersonDocId;
            const generalCommentsRes = await axios.get(`${API_URL}report/voice-of-customer/general-comments/export?companyId=${selectedCompanyId}${!salespersonFilter? '' : `&salesPersonDocId=${salespersonFilter}`}${!industryId? '':`&industryId=${industryId}`}${!customerTypeId? '':`&customerTypeId=${customerTypeId}`}${!province? '':`&province=${province}`}${!customerId? '':`&customerId=${customerId}`}`, {
                responseType: 'blob'
            });
            // to use, data is returned as payloadResult
            if (generalCommentsRes.status === 200 || generalCommentsRes.status === 204) {
                const url = window.URL.createObjectURL(new Blob([generalCommentsRes.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'report.xlsx');
                document.body.appendChild(link);
                link.click();
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
                type: SET_GENERAL_COMMENTS_STATE,
                payload: { loading: false }
            });
        }
    }
}

