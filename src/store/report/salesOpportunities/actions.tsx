import {
    SalesOpportunitiesAction,
    SET_SALES_OPPORTUNITIES_STATE,
    SalesOpportunitiesStateInput,
} from './types';
import { 
    ALERT_STATE
} from '../../alert/types';
import { SystemState } from '../../system/types';
import { AppThunk } from '../..';
import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;

export const setSalesOpportunitiesState = (data: SalesOpportunitiesStateInput): SalesOpportunitiesAction => ({
    type : SET_SALES_OPPORTUNITIES_STATE,
    payload: data
});

export const resetFilter = (state: Array<string>): AppThunk => (dispatch) => {
    state.forEach(filter => {
        dispatch({
            type: SET_SALES_OPPORTUNITIES_STATE,
            payload: { [filter]: '' }
        });
    });
};

export const getSalesOpportunitiesInfo = () : AppThunk => {
    return async (dispatch, getState) => {
        const { token, userDetails } = getState().system.session;
        const { salesPersonDocId, customerDocId, makeDocId, startDate, endDate, selectedCompanyId, customerTypeId, province, modelId, productFamilyId, industryId, viewType } = getState().salesOpportunitiesState;

        dispatch({
            type: SET_SALES_OPPORTUNITIES_STATE,
            payload: { loading: true, salesOpportunities: { report: [],status: {} }}
        });
        try {
            const salespersonFilter = (userDetails.role as string).toLowerCase() === 'sales engineer' ? `${userDetails.id}` : salesPersonDocId;
            const payloadResult = await axios.get(`${API_URL}report/sales-opportunity?companyId=${selectedCompanyId}${`&startDate=${startDate}`}${`&endDate=${endDate}`}${!salespersonFilter? '' : `&salesPersonDocId=${salespersonFilter}`}${!customerDocId? '':`&customerDocId=${customerDocId}`}${!makeDocId? '':`&makeDocId=${makeDocId}`}${!industryId? '':`&industryId=${industryId}`}${!customerTypeId? '':`&customerTypeId=${customerTypeId}`}${!province? '':`&province=${province}`}${!modelId? '':`&modelId=${modelId}`}${!productFamilyId? '':`&productFamilyId=${productFamilyId}`}${!viewType? '':`&viewType=${viewType}`}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            // // to use, data is returned as payloadResult
            if (payloadResult.status === 200 || payloadResult.status === 204) {
                dispatch({
                    type: SET_SALES_OPPORTUNITIES_STATE,
                    payload: { salesOpportunities: {...payloadResult.data} }
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
                type: SET_SALES_OPPORTUNITIES_STATE,
                payload: { loading: false }
            });
        }
    }
}

export const exportSalesOpportunities = (system: SystemState): AppThunk => async (dispatch, getState) => {
    const { userDetails } = system.session;
    dispatch({
        type: SET_SALES_OPPORTUNITIES_STATE,
        payload: { loading: true }
    });
    try {
        const { salesPersonDocId, customerDocId, makeDocId, startDate, endDate, selectedCompanyId, customerTypeId, province, modelId, productFamilyId, industryId } = getState().salesOpportunitiesState; // uncomment this to get filter data using destructuring
        const salespersonFilter = (userDetails.role as string).toLowerCase() === 'sales engineer' ? `${userDetails.id}` : salesPersonDocId;
        const reportRes = await axios.get(`${API_URL}report/sales-opportunity/export?companyId=${selectedCompanyId}${`&startDate=${startDate}`}${`&endDate=${endDate}`}${!salespersonFilter? '' : `&salesPersonDocId=${salespersonFilter}`}${!customerDocId? '':`&customerDocId=${customerDocId}`}${!makeDocId? '':`&makeDocId=${makeDocId}`}${!industryId? '':`&industryId=${industryId}`}${!customerTypeId? '':`&customerTypeId=${customerTypeId}`}${!province? '':`&province=${province}`}${!modelId? '':`&modelId=${modelId}`}${!productFamilyId? '':`&productFamilyId=${productFamilyId}`}`, {
            responseType: 'blob'
        });
        if (reportRes.status === 200 || reportRes.status === 204) {
            const url = window.URL.createObjectURL(new Blob([reportRes.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Sales Report.xlsx');
            document.body.appendChild(link);
            link.click();
        }
    }
    catch (err) {
        let msg = err.response.data.error.message
        msg = msg.split(':').pop();
        dispatch({
            type: ALERT_STATE,
            payload: {alertOpen: true, alertMessage: msg, alertType: 'error'}
        });
    }
    finally {
        // on everything that can happen, revert the loading state
        dispatch({
            type: SET_SALES_OPPORTUNITIES_STATE,
            payload: { loading: false }
        });
    }
}