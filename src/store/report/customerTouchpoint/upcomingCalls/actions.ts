import {
    SET_UPCOMING_CALLS_STATE,
    UpcomingCallsAction,
    UpcomingCallsStateInput
} from './types';
import { 
    ALERT_STATE
} from '../../../alert/types';
import { SystemState } from '../../../system/types';
import { AppThunk } from '../../..';
import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;

export const setUpcomingCallsState = (state: UpcomingCallsStateInput): UpcomingCallsAction => ({
    type: SET_UPCOMING_CALLS_STATE,
    payload: state
});

export const resetFilter = (state: Array<string>): AppThunk => (dispatch) => {
    state.forEach(filter => {
        dispatch({
            type: SET_UPCOMING_CALLS_STATE,
            payload: { [filter]: '' }
        });
    });
};

/**
 * @description fetches the product performance data for the report
 * @returns the redux action that was called using Redux Thunk
 */
export const getUpcomingCalls = (system: SystemState): AppThunk => async (dispatch, getState) => {
    const { userDetails } = system.session;
    dispatch({
        type: SET_UPCOMING_CALLS_STATE,
        payload: { loading: true, upcomingList: [] }
    });

    try {
        const { 
            filterSelectedCompany, filterSelectedSalesperson, filterSelectedProvince, 
            filterSelectedIndustry, filterSelectedCustomerType, filterStartDate, filterSelectedViewType
        } = getState().upcomingCallsState; // uncomment this to get filter data using destructuring
        const salespersonFilter = (userDetails.role as string).toLowerCase() === 'sales engineer' ? `${userDetails.id}` : filterSelectedSalesperson;
        const reportRes = await axios.get(`${API_URL}report/customer-touchpoint/upcoming-calls-visits?companyId=${filterSelectedCompany}${!salespersonFilter? '' : `&salesPersonDocId=${salespersonFilter}`}${!filterSelectedIndustry? '':`&industryId=${filterSelectedIndustry}`}${!filterSelectedCustomerType? '':`&customerTypeId=${filterSelectedCustomerType}`}${!filterSelectedProvince? '':`&province=${filterSelectedProvince}`}${!filterStartDate? '':`&startDate=${filterStartDate}`}${!filterSelectedViewType? '':`&viewType=${filterSelectedViewType}`}`);
        if (reportRes.status === 200 || reportRes.status === 204) {
            const { report, status } = reportRes.data;
            dispatch({
                type: SET_UPCOMING_CALLS_STATE,
                payload: { upcomingList: status, report }
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
            type: SET_UPCOMING_CALLS_STATE,
            payload: { loading: false }
        });
    }
}

export const exportUpcomingCalls = (system: SystemState): AppThunk => async (dispatch, getState) => {
    const { userDetails } = system.session;
    dispatch({
        type: SET_UPCOMING_CALLS_STATE,
        payload: { loading: true }
    });
    try {
        const { 
            filterSelectedCompany, filterSelectedSalesperson, filterSelectedProvince, 
            filterSelectedIndustry, filterSelectedCustomerType, filterStartDate, filterSelectedViewType
        } = getState().upcomingCallsState; // uncomment this to get filter data using destructuring
        const salespersonFilter = (userDetails.role as string).toLowerCase() === 'sales engineer' ? `${userDetails.id}` : filterSelectedSalesperson;
        const reportRes = await axios.get(`${API_URL}report/customer-touchpoint/upcoming-calls-visits/export?companyId=${filterSelectedCompany}${!salespersonFilter? '' : `&salesPersonDocId=${salespersonFilter}`}${!filterSelectedIndustry? '':`&industryId=${filterSelectedIndustry}`}${!filterSelectedCustomerType? '':`&customerTypeId=${filterSelectedCustomerType}`}${!filterSelectedProvince? '':`&province=${filterSelectedProvince}`}${!filterStartDate? '':`&startDate=${filterStartDate}`}${!filterSelectedViewType? '':`&viewType=${filterSelectedViewType}`}`, {
            responseType: 'blob'
        });
        if (reportRes.status === 200 || reportRes.status === 204) {
            const url = window.URL.createObjectURL(new Blob([reportRes.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Upcoming Calls Report.xlsx');
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
            type: SET_UPCOMING_CALLS_STATE,
            payload: { loading: false }
        });
    }
}