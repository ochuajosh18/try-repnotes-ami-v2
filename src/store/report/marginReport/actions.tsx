import {
    MarginAction,
    MarginDetails,
    MarginState,
    MarginStateInput,
    SET_MARGIN_STATE
} from './types';
import { 
    ALERT_STATE
} from '../../alert/types';
import { SystemState } from '../../system/types';
import { AppThunk } from '../..';
import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;

export const setMarginState = (state: MarginStateInput): MarginAction => ({
    type : SET_MARGIN_STATE,
    payload: state
});

export const resetFilter = (state: Array<string>): AppThunk => (dispatch) => {
    state.forEach(filter => {
        dispatch({
            type: SET_MARGIN_STATE,
            payload: { [filter]: '' }
        });
    });
};

export const getMarginCustomerTypeList = (): AppThunk => {
    return async (dispatch, getState) => {
        const { token, userDetails } = getState().system.session;
        const { selectedCompanyId } = getState().marginState;
        dispatch({
            type: SET_MARGIN_STATE,
            payload: { loading: true, marginCustomerTypeList: [] }
        });
        try {
            const payloadResult = await axios.get(`${API_URL}report/margin-report/filter/customerType?companyId=${selectedCompanyId ? selectedCompanyId : userDetails.companyId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            // to use, data is returned as payloadResult
            if (payloadResult.status === 200 || payloadResult.status === 204) {
                dispatch({
                    type: SET_MARGIN_STATE,
                    payload: { marginCustomerTypeList: [...payloadResult.data] }
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
                type: SET_MARGIN_STATE,
                payload: { loading: false }
            });
        }
    }
}

export const getMarginModelList = (): AppThunk => {
    return async (dispatch, getState) => {
        const { token, userDetails } = getState().system.session;
        const { selectedCompanyId } = getState().marginState;
        dispatch({
            type: SET_MARGIN_STATE,
            payload: { loading: true, marginModelList: [] }
        });
        try {
            const payloadResult = await axios.get(`${API_URL}report/margin-report/filter/model?companyId=${selectedCompanyId ? selectedCompanyId:userDetails.companyId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            // to use, data is returned as payloadResult
            if (payloadResult.status === 200 || payloadResult.status === 204) {
                dispatch({
                    type: SET_MARGIN_STATE,
                    payload: { marginModelList: [...payloadResult.data] }
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
                type: SET_MARGIN_STATE,
                payload: { loading: false }
            });
        }
    }
}

export const getMarginProvinceList = (): AppThunk => {
    return async (dispatch, getState) => {
        const { token, userDetails } = getState().system.session;
        const { selectedCompanyId } = getState().marginState;
        dispatch({
            type: SET_MARGIN_STATE,
            payload: { loading: true, marginProvinceList: [] }
        });
        try {
            const payloadResult = await axios.get(`${API_URL}report/margin-report/filter/province?companyId=${selectedCompanyId ? selectedCompanyId:userDetails.companyId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            // to use, data is returned as payloadResult
            if (payloadResult.status === 200 || payloadResult.status === 204) {
                dispatch({
                    type: SET_MARGIN_STATE,
                    payload: { marginProvinceList: [...payloadResult.data] }
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
                type: SET_MARGIN_STATE,
                payload: { loading: false }
            });
        }
    }
}

export const getMarginCustomerList = (): AppThunk => {
    return async (dispatch, getState) => {
        const { token, userDetails } = getState().system.session;
        const { selectedCompanyId } = getState().marginState;
        dispatch({
            type: SET_MARGIN_STATE,
            payload: { loading: true, marginProvinceList: [] }
        });
        try {
            const payloadResult = await axios.get(`${API_URL}report/margin-report/filter/customer?companyId=${selectedCompanyId ? selectedCompanyId:userDetails.companyId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            // to use, data is returned as payloadResult
            if (payloadResult.status === 200 || payloadResult.status === 204) {
                dispatch({
                    type: SET_MARGIN_STATE,
                    payload: { marginCustomerList: [...payloadResult.data] }
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
                type: SET_MARGIN_STATE,
                payload: { loading: false }
            });
        }
    }
}

export const getMarginProductFamilyList = (): AppThunk => {
    return async (dispatch, getState) => {
        const { token, userDetails } = getState().system.session;
        const { selectedCompanyId } = getState().marginState;
        dispatch({
            type: SET_MARGIN_STATE,
            payload: { loading: true, marginProductFamilyList: [] }
        });
        try {
            const payloadResult = await axios.get(`${API_URL}report/margin-report/filter/productFamily?companyId=${selectedCompanyId ? selectedCompanyId:userDetails.companyId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            // to use, data is returned as payloadResult
            if (payloadResult.status === 200 || payloadResult.status === 204) {
                dispatch({
                    type: SET_MARGIN_STATE,
                    payload: { marginProductFamilyList: [...payloadResult.data] }
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
                type: SET_MARGIN_STATE,
                payload: { loading: false }
            });
        }
    }
}

export const getMarginInfo = (state?: Partial<MarginState>) : AppThunk => {
    return async (dispatch, getState) => {
        const { customerTypeId, selectedSalespersonId, modelId, productFamilyId, provinceId, selectedCustomerId, selectedCompanyId, marginStartDate, marginEndDate } = state ? { ...getState().marginState, ...state } : getState().marginState;
        dispatch({
            type: SET_MARGIN_STATE,
            payload: { loading: true, rollingYear: '', invoiceAmount: 0, cost: 0, marginResult: {} }
        });
        try {
            const { userDetails } = getState().system.session;
            const companyFilter = selectedCompanyId ? `companyId=${selectedCompanyId}` : `companyId=${userDetails.companyId}`;
            const salespersonFilter = selectedSalespersonId ? `&salesman=${selectedSalespersonId}` : userDetails.role.toString() !== 'SUPER ADMIN' ? `&salesman=${userDetails.id}` : '';
            const customerTypeFilter = customerTypeId ? `&customerType=${customerTypeId}` : '';
            const provinceFilter = provinceId ? `&province=${provinceId}` : '';
            const modelFilter = modelId ? `&model=${modelId}` : '';
            const productFamilyFilter = productFamilyId ? `&productFamily=${productFamilyId}` : '';
            const customerFilter = selectedCustomerId ? `&customer=${selectedCustomerId}` : '';
            const startDateFilter = marginStartDate ? `&startDate=${marginStartDate}` : '';
            const endDateFilter = marginEndDate ? `&endDate=${marginEndDate}` : '';
            const marginReportRes = await axios.get(`${API_URL}report/margin-report?${companyFilter}${customerTypeFilter}${provinceFilter}${salespersonFilter}${modelFilter}${productFamilyFilter}${customerFilter}${startDateFilter}${endDateFilter}`);
            if (marginReportRes.status === 200 || marginReportRes.status === 204) {
                const { status, report } = marginReportRes.data;
                dispatch({
                    type: SET_MARGIN_STATE,
                    payload: { 
                        rollingYear: status.rollingYear, 
                        invoiceAmount: status.invoiceAmount, 
                        cost: status.cost ,
                        marginResult: status.marginResult,
                        report
                    }
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
                type: SET_MARGIN_STATE,
                payload: { loading: false }
            });
        }
    }
}

export const clearImportDialog = (): MarginAction => ({
    type : SET_MARGIN_STATE,
    payload: { dialogOpen: false, marginList: [] }
});

export const importMarginData = (system: SystemState, file: File | any, companyId?: string ): AppThunk => {
    return async (dispatch) => {
        const { token } = system.session;
        if(companyId){
            dispatch({
                type: SET_MARGIN_STATE,
                payload: { loading: true, marginList: [] }
            });
            try {
                let formData = new FormData()
                formData.append('uploads[]', file[0], file[0].name)
                const payloadResult = await axios.post(`${API_URL}media/excel/upload/margin?companyId=${companyId ? companyId:system.session.userDetails.companyId}`, formData, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                // to use, data is returned as payloadResult
                if (payloadResult.status === 200 || payloadResult.status === 204) {
                    dispatch({
                        type: SET_MARGIN_STATE,
                        payload: { marginList: [...(payloadResult.data as Array<MarginDetails>).filter(item => item.date !== '' && item)] }
                    });
                    if(payloadResult.data.length > 0){
                        dispatch({
                            type: SET_MARGIN_STATE,
                            payload: { dialogOpen: true }
                        });
                    }
                }
            }catch(err){
                let msg = "";
                err.response.status === 409 ? msg = err.response.data.message : msg = err.response.data.error.message;
                dispatch({
                    type: ALERT_STATE,
                    payload: {alertOpen: true, alertMessage: msg.split(':').pop(), alertType: 'error'}
                });
            }finally {
                dispatch({
                    type: SET_MARGIN_STATE,
                    payload: { loading: false }
                });
            }
        }else {
            dispatch({
                type: ALERT_STATE,
                payload: {alertOpen: true, alertMessage: "Please Select a company", alertType: 'warning'}
            });
        }
    }
}

export const saveImportData = (): AppThunk => {
    return async (dispatch, getState) => {
        dispatch({
            type: SET_MARGIN_STATE,
            payload: { uploadLoading: true }
        });
        try {
            const { marginList } = getState().marginState; // uncomment this to get filter data using destructuring
            const payloadResult = await axios.post(`${API_URL}report/margin-report`, marginList);
            if (payloadResult.status === 200 || payloadResult.status === 204) {
                dispatch({
                    type: ALERT_STATE,
                    payload: { alertOpen : true, alertMessage: `Uploading Done! ${payloadResult.data.count} of ${marginList.length} uploaded.`, alertType: "success"  }
                });
                dispatch(getMarginInfo());
            }
        }catch(err){
        }finally {
            dispatch({
                type: SET_MARGIN_STATE,
                payload: { uploadLoading: false, dialogOpen: false, uploadedCount: 0 }
            });
        }
    }
}


/**
 * @description gets the excel document for marignReport data 
 * @returns the redux action that was called using Redux Thunk
 */
 export const exportMarginReport = (companyId?: string): AppThunk => async (dispatch, getState) => {
    dispatch({
        type: SET_MARGIN_STATE,
        payload: { loading: true }
    });
    try {
        const { userDetails } = getState().system.session;
        const { selectedCompanyId, customerTypeId, modelId, productFamilyId, provinceId, selectedSalespersonId, selectedCustomerId } = getState().marginState;
        const companyFilter = selectedCompanyId ? `companyId=${selectedCompanyId}` : `companyId=${userDetails.companyId}`;
        const salespersonFilter = selectedSalespersonId ? `&salesman=${selectedSalespersonId}` : userDetails.role.toString() !== 'SUPER ADMIN' ? `salesman=${userDetails.id}` : '';
        const customerTypeFilter = customerTypeId ? `&customerType=${customerTypeId}` : '';
        const provinceFilter = provinceId ? `&province=${provinceId}` : '';
        const modelFilter = modelId ? `&model=${modelId}` : '';
        const productFamilyFilter = productFamilyId ? `&productFamily=${productFamilyId}` : '';
        const customerFilter = selectedCustomerId ? `&customer=${selectedCustomerId}` : '';
        const reportRes = await axios.get(`${API_URL}report/margin-report/export?${companyFilter}${customerTypeFilter}${provinceFilter}${salespersonFilter}${modelFilter}${productFamilyFilter}${customerFilter}`, {
            responseType: 'blob'
        });
        if (reportRes.status === 200 || reportRes.status === 204) {
            const url = window.URL.createObjectURL(new Blob([reportRes.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Margin Report.xlsx');
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
            type: SET_MARGIN_STATE,
            payload: { loading: false }
        });
    }
}