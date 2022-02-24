import {
    SET_QUOTES_BY_STATUS_STATE,
    QuotesByStatusAction,
    QuotesByStatusStateInput
} from './types';
import { AppThunk } from '../..';
import { 
    ALERT_STATE
} from '../../alert/types';
import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;

export const setQuotesByStatusState = (state: QuotesByStatusStateInput): QuotesByStatusAction => ({
    type: SET_QUOTES_BY_STATUS_STATE,
    payload: state
});

export const resetFilter = (state: Array<string>): AppThunk => (dispatch) => {
    state.forEach(filter => {
        dispatch({
            type: SET_QUOTES_BY_STATUS_STATE,
            payload: { [filter]: '' }
        });
    });
};

/**
 * @description fetches the qoutes by status data for the report
 * @returns the redux action that was called using Redux Thunk
 */
export const getQuoteByStatus = (companyId?: string): AppThunk => async (dispatch, getState) => {
    const { userDetails } = getState().system.session;
    dispatch({
        type: SET_QUOTES_BY_STATUS_STATE,
        payload: { loading: true }
    });
    try {
        const {
            filterSelectedCompany, filterSelectedSalesperson, filterSelectedProvince, 
            filterSelectedIndustry, filterSelectedCustomerType, filterSelectedViewType
        } = getState().quotesByStatusState; // uncomment this to get filter data using destructuring
        const salespersonFilter = (userDetails.role as string).toLowerCase() === 'sales engineer' ? `${userDetails.id}` : filterSelectedSalesperson;
        const reportRes = await axios.get(`${API_URL}report/quote-by-status?companyId=${companyId ? companyId : filterSelectedCompany}${!salespersonFilter? '' : `&salesPersonDocId=${salespersonFilter}`}${!filterSelectedIndustry? '':`&industryId=${filterSelectedIndustry}`}${!filterSelectedCustomerType? '':`&customerTypeId=${filterSelectedCustomerType}`}${!filterSelectedProvince? '':`&province=${filterSelectedProvince}`}${!filterSelectedViewType? '':`&viewType=${filterSelectedViewType}`}`);
        if (reportRes.status === 200 || reportRes.status === 204) {
            const { report, status } = reportRes.data;
            dispatch({
                type: SET_QUOTES_BY_STATUS_STATE,
                payload: {
                    report,
                    summaryOpenQuotes: status.summaryOpenQuotes,
                    summaryCloseLost: status.summaryCloseLost, 
                    summaryCloseWon: status.summaryCloseWon,
                    summaryWithdraw: status.summaryWithdraw
                }
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
            type: SET_QUOTES_BY_STATUS_STATE,
            payload: { loading: false }
        });
    }
}


/**
 * @description gets the excel document for quotes by status data 
 * @returns the redux action that was called using Redux Thunk
 */
 export const exportQuotesByStatus = (companyId?: string): AppThunk => async (dispatch, getState) => {
    const { userDetails } = getState().system.session;
    dispatch({
        type: SET_QUOTES_BY_STATUS_STATE,
        payload: { loading: true }
    });
    try {
        const {
            filterSelectedCompany, filterSelectedSalesperson, filterSelectedProvince, 
            filterSelectedIndustry, filterSelectedCustomerType
        } = getState().quotesByStatusState; // uncomment this to get filter data using destructuring
        const salespersonFilter = (userDetails.role as string).toLowerCase() === 'sales engineer' ? `${userDetails.id}` : filterSelectedSalesperson;
        const reportRes = await axios.get(`${API_URL}report/quote-by-status/export?companyId=${companyId ? companyId : filterSelectedCompany}${!salespersonFilter? '' : `&salesPersonDocId=${salespersonFilter}`}${!filterSelectedIndustry? '':`&industryId=${filterSelectedIndustry}`}${!filterSelectedCustomerType? '':`&customerTypeId=${filterSelectedCustomerType}`}${!filterSelectedProvince? '':`&province=${filterSelectedProvince}`}`, {
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
            type: SET_QUOTES_BY_STATUS_STATE,
            payload: { loading: false }
        });
    }
}