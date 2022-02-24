import {
    SET_UNMET_NEEDS_STATE,
    UnmetNeedsSalesPersonDocIdFilter,
    UnmetNeedsAction,
    UnmetNeedsProvinceFilter,
    UnmetNeedsIndustryFilter,
    UnmetNeedsCustomerTypeFilter,
    UnmetNeedsModelFilter,
    SetUNSelectedCompanyFilter,
    UnmetNeedsState,
    DynamicUnmetNeedsInputInterface,
    DynamicUnmetNeedsType
} from './types';
import { 
    ALERT_STATE
} from '../../../alert/types';
import { SystemState } from '../../../system/types';
import { AppThunk } from '../../..';
import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;

export const setUnmetNeedsState = (state: DynamicUnmetNeedsInputInterface<DynamicUnmetNeedsType>): UnmetNeedsAction => ({
    type: SET_UNMET_NEEDS_STATE,
    payload: state
});

export const setUNCompanyFilter = (data: SetUNSelectedCompanyFilter): UnmetNeedsAction => ({
    type : SET_UNMET_NEEDS_STATE,
    payload: { ...data, salesPersonDocId: "", province: "", industryId: "", customerTypeId: "", modelId: "" }
});

export const setSalesPersonDocIdFilter = (data: UnmetNeedsSalesPersonDocIdFilter): UnmetNeedsAction => ({
    type : SET_UNMET_NEEDS_STATE,
    payload: data
});

export const setProvinceFilter = (data: UnmetNeedsProvinceFilter): UnmetNeedsAction => ({
    type : SET_UNMET_NEEDS_STATE,
    payload: data
});

export const setIndustryFilter = (data: UnmetNeedsIndustryFilter): UnmetNeedsAction => ({
    type : SET_UNMET_NEEDS_STATE,
    payload: data
});

export const setCustomerTypeFilter = (data: UnmetNeedsCustomerTypeFilter): UnmetNeedsAction => ({
    type : SET_UNMET_NEEDS_STATE,
    payload: data
});

export const setModelFilter = (data: UnmetNeedsModelFilter): UnmetNeedsAction => ({
    type : SET_UNMET_NEEDS_STATE,
    payload: data
});

export const getUnmetNeeds = (system: SystemState, data: UnmetNeedsState) : AppThunk => {
    return async (dispatch) => {
        const { token, userDetails } = system.session;
        const { salesPersonDocId, province, customerTypeId, industryId, selectedCompanyId, modelId, unmetNeedsStartDate, unmetNeedsEndDate } = data;
        dispatch({
            type: SET_UNMET_NEEDS_STATE,
            payload: { loading: true, unmetNeedsInfo: {} }
        });
        try {
            const salespersonFilter = (userDetails.role as string).toLowerCase() === 'sales engineer' ? `${userDetails.id}` : salesPersonDocId;
            const startDateFilter = unmetNeedsStartDate ? `&startDate=${unmetNeedsStartDate}` : '';
            const endDateFilter = unmetNeedsEndDate ? `&endDate=${unmetNeedsEndDate}` : '';
            const unmetNeedsRes = await axios.get(`${API_URL}report/voice-of-customer/unmet-needs?companyId=${selectedCompanyId}${!salespersonFilter? '' : `&salesPersonDocId=${salespersonFilter}`}${!industryId? '':`&industryId=${industryId}`}${!customerTypeId? '':`&customerTypeId=${customerTypeId}`}${!province? '':`&province=${province}`}${!modelId? '':`&modelId=${modelId}`}${startDateFilter}${endDateFilter}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            // to use, data is returned as payloadResult
            if (unmetNeedsRes.status === 200 || unmetNeedsRes.status === 204) {
                const { report, status} = unmetNeedsRes.data;
                dispatch({
                    type: SET_UNMET_NEEDS_STATE,
                    payload: { unmetNeedsInfo: status, report }
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
                type: SET_UNMET_NEEDS_STATE,
                payload: { loading: false }
            });
        }
    }
}


export const exportUnmetNeeds = () : AppThunk => {
    return async (dispatch, getState) => {
        const { userDetails } = getState().system.session;
        const { salesPersonDocId, province, customerTypeId, industryId, selectedCompanyId, modelId } = getState().unmetNeedsState;
        dispatch({
            type: SET_UNMET_NEEDS_STATE,
            payload: { loading: true }
        });
        try {
            const salespersonFilter = (userDetails.role as string).toLowerCase() === 'sales engineer' ? `${userDetails.id}` : salesPersonDocId;
            const unmetNeedsRes = await axios.get(`${API_URL}report/voice-of-customer/unmet-needs/export?companyId=${selectedCompanyId}${!salespersonFilter? '' : `&salesPersonDocId=${salespersonFilter}`}${!industryId? '':`&industryId=${industryId}`}${!customerTypeId? '':`&customerTypeId=${customerTypeId}`}${!province? '':`&province=${province}`}${!modelId? '':`&modelId=${modelId}`}`, {
                responseType: 'blob'
            });
            // to use, data is returned as payloadResult
            if (unmetNeedsRes.status === 200 || unmetNeedsRes.status === 204) {
                const url = window.URL.createObjectURL(new Blob([unmetNeedsRes.data]));
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
                type: SET_UNMET_NEEDS_STATE,
                payload: { loading: false }
            });
        }
    }
}

