import {
    CustomerExperienceAction,
    SET_CUSTOMER_EXPERIENCE_STATE,
    DynamicCustomerExperienceInputInterface,
    DynamicCustomerExperienceType
} from './types';
import { 
    ALERT_STATE
} from '../../../alert/types';
import { AppThunk } from '../../..';
import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;

export const setCustomerExperienceState = (state: DynamicCustomerExperienceInputInterface<DynamicCustomerExperienceType>): CustomerExperienceAction => ({
    type: SET_CUSTOMER_EXPERIENCE_STATE,
    payload: state
});

export const resetFilter = (state: Array<string>): AppThunk => (dispatch) => {
    state.forEach(filter => {
        dispatch({
            type: SET_CUSTOMER_EXPERIENCE_STATE,
            payload: { [filter]: '' }
        });
    });
};

export const getCustomerExperience = () : AppThunk => {
    return async (dispatch, getState) => {
        const { userDetails } = getState().system.session;
        const { salesPersonDocId, province, customerTypeId, industryId, selectedCompanyId, customerId, rating, yearDate } = getState().customerExperienceState;
        dispatch({
            type: SET_CUSTOMER_EXPERIENCE_STATE,
            payload: { loading: true, customerExperienceInfo: {} }
        });
        try {
            const salespersonFilter = (userDetails.role as string).toLowerCase() === 'sales engineer' ? `${userDetails.id}` : salesPersonDocId;
            const customerExperienceRes = await axios.get(`${API_URL}report/voice-of-customer/customer-experience?companyId=${selectedCompanyId}${!salespersonFilter? '' : `&salesPersonDocId=${salespersonFilter}`}${!industryId? '':`&industryId=${industryId}`}${!customerTypeId? '':`&customerTypeId=${customerTypeId}`}${!province? '':`&province=${province}`}${!customerId? '':`&customerId=${customerId}`}${!rating? '':`&rating=${rating}`}${!yearDate? '':`&year=${yearDate}`}`);
            // to use, data is returned as payloadResult
            if (customerExperienceRes.status === 200 || customerExperienceRes.status === 204) {
                const { report, status } = customerExperienceRes.data;
                dispatch({
                    type: SET_CUSTOMER_EXPERIENCE_STATE,
                    payload: { 
                        customerExperienceInfo: status,
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
                type: SET_CUSTOMER_EXPERIENCE_STATE,
                payload: { loading: false }
            });
        }
    }
}

export const exportCustomerExperience = () : AppThunk => {
    return async (dispatch, getState) => {
        const { userDetails } = getState().system.session;
        const { salesPersonDocId, province, customerTypeId, industryId, selectedCompanyId, customerId, rating, yearDate } = getState().customerExperienceState;
        dispatch({
            type: SET_CUSTOMER_EXPERIENCE_STATE,
            payload: { loading: true }
        });
        try {
            const salespersonFilter = (userDetails.role as string).toLowerCase() === 'sales engineer' ? `${userDetails.id}` : salesPersonDocId;
            const customerExperienceRes = await axios.get(`${API_URL}report/voice-of-customer/customer-experience/export?companyId=${selectedCompanyId}${!salespersonFilter? '' : `&salesPersonDocId=${salespersonFilter}`}${!industryId? '':`&industryId=${industryId}`}${!customerTypeId? '':`&customerTypeId=${customerTypeId}`}${!province? '':`&province=${province}`}${!customerId? '':`&customerId=${customerId}`}${!rating? '':`&rating=${rating}`}${!yearDate? '':`&year=${yearDate}`}`, { 
                responseType: 'blob' 
            });
            if (customerExperienceRes.status === 200 || customerExperienceRes.status === 204) {
                const url = window.URL.createObjectURL(new Blob([customerExperienceRes.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'Customer Experience Report.xlsx');
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
                type: SET_CUSTOMER_EXPERIENCE_STATE,
                payload: { loading: false }
            });
        }
    }
}