import {
    SET_PRODUCT_PERFORMANCE_STATE,
    ProductPerformanceAction,
    ProductPerformanceStateInput
} from './types';
import { 
    ALERT_STATE
} from '../../../alert/types';
import { SystemState } from '../../../system/types';
import { AppThunk } from '../../..';
import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;

export const setProductPerformanceState = (state: ProductPerformanceStateInput): ProductPerformanceAction => ({
    type: SET_PRODUCT_PERFORMANCE_STATE,
    payload: state
});

export const resetFilter = (state: Array<string>): AppThunk => (dispatch) => {
    state.forEach(filter => {
        dispatch({
            type: SET_PRODUCT_PERFORMANCE_STATE,
            payload: { [filter]: '' }
        });
    });
};

/**
 * @description fetches the product performance data for the report
 * @returns the redux action that was called using Redux Thunk
 */
export const getProductPerformance = (system: SystemState): AppThunk => async (dispatch, getState) => {
    const { userDetails } = system.session;
    dispatch({
        type: SET_PRODUCT_PERFORMANCE_STATE,
        payload: { loading: true, productPerformanceList: [] }
    });
    try {
        const { 
            filterSelectedCompany, filterSelectedSalesperson, filterSelectedProvince, 
            filterSelectedIndustry, filterSelectedCustomerType, filterSelectedProductFamily, 
            filterSelectedRating , filterSelectedCustomer, filterSelectedModel, filterSelectedViewType, filterSelectedServiceRanking
        } = getState().productPerformanceState; // uncomment this to get filter data using destructuring
        const salespersonFilter = (userDetails.role as string).toLowerCase() === 'sales engineer' ? `${userDetails.id}` : filterSelectedSalesperson;
        const reportRes = await axios.get(`${API_URL}report/voice-of-customer/product-performance?companyId=${filterSelectedCompany}${!salespersonFilter? '' : `&salesPersonDocId=${salespersonFilter}`}${!filterSelectedIndustry? '':`&industryId=${filterSelectedIndustry}`}${!filterSelectedCustomerType? '':`&customerTypeId=${filterSelectedCustomerType}`}${!filterSelectedProvince? '':`&province=${filterSelectedProvince}`}${!filterSelectedProductFamily? '':`&productFamilyId=${filterSelectedProductFamily}`}${!filterSelectedRating? '':`&rating=${filterSelectedRating}`}${!filterSelectedServiceRanking? '':`&serviceRanking=${filterSelectedServiceRanking}`}${!filterSelectedCustomer? '':`&customerId=${filterSelectedCustomer}`}${!filterSelectedModel? '':`&modelId=${filterSelectedModel}`}${!filterSelectedViewType? '':`&viewType=${filterSelectedViewType}`}`);
        if (reportRes.status === 200 || reportRes.status === 204) {
            const { report, status } = reportRes.data;
            dispatch({
                type: SET_PRODUCT_PERFORMANCE_STATE,
                payload: { report, productPerformanceList: status }
            });
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
            type: SET_PRODUCT_PERFORMANCE_STATE,
            payload: { loading: false }
        });
    }
}

export const exportProductPerformance = (system: SystemState): AppThunk => async (dispatch, getState) => {
    const { token } = system.session;
    dispatch({
        type: SET_PRODUCT_PERFORMANCE_STATE,
        payload: { loading: true }
    });
    try {
        const { 
            filterSelectedCompany, filterSelectedSalesperson, filterSelectedProvince, 
            filterSelectedIndustry, filterSelectedCustomerType, filterSelectedProductFamily, 
            filterSelectedRating, filterSelectedCustomer, filterSelectedModel, filterSelectedServiceRanking
        } = getState().productPerformanceState; // uncomment this to get filter data using destructuring
        const reportRes = await axios.get(`${API_URL}report/voice-of-customer/product-performance/export?companyId=${filterSelectedCompany}${!filterSelectedSalesperson? '' : `&salesPersonDocId=${filterSelectedSalesperson}`}${!filterSelectedIndustry? '':`&industryId=${filterSelectedIndustry}`}${!filterSelectedCustomerType? '':`&customerTypeId=${filterSelectedCustomerType}`}${!filterSelectedProvince? '':`&province=${filterSelectedProvince}`}${!filterSelectedProductFamily? '':`&productFamilyId=${filterSelectedProductFamily}`}${!filterSelectedRating? '':`&rating=${filterSelectedRating}`}${!filterSelectedServiceRanking? '':`&serviceRanking=${filterSelectedServiceRanking}`}${!filterSelectedCustomer? '':`&customerId=${filterSelectedCustomer}`}${!filterSelectedModel? '':`&modelId=${filterSelectedModel}`}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            responseType: 'blob'
        });
        if (reportRes.status === 200 || reportRes.status === 204) {
            const url = window.URL.createObjectURL(new Blob([reportRes.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'report.xlsx');
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
            type: SET_PRODUCT_PERFORMANCE_STATE,
            payload: { loading: false }
        });
    }
}