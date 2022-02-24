import {
    CompetitionAction,
    DynamicCompetitionInformationInterface,
    DynamicCompetitionInformationType,
    SET_COMPETITION_STATE
} from './types';
import { 
    ALERT_STATE
} from '../../../alert/types';
import { AppThunk } from '../../..';
import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;

export const setCompetitionInformationState = (state: DynamicCompetitionInformationInterface<DynamicCompetitionInformationType>): CompetitionAction => ({
    type: SET_COMPETITION_STATE,
    payload: state
});

export const resetFilter = (state: Array<string>): AppThunk => (dispatch) => {
    state.forEach(filter => {
        dispatch({
            type: SET_COMPETITION_STATE,
            payload: { [filter]: '' }
        });
    });
};

export const getCompetitionInfo = () : AppThunk => {
    return async (dispatch, getState) => {
        const { userDetails } = getState().system.session;
        const { salesPersonDocId, province, customerTypeId, industryId, selectedCompanyId, customerId } = getState().competitionState;
        dispatch({
            type: SET_COMPETITION_STATE,
            payload: { loading: true, competitionInfo: {} }
        });
        try {
            const salespersonFilter = (userDetails.role as string).toLowerCase() === 'sales engineer' ? `${userDetails.id}` : salesPersonDocId;
            const competitionInfoRes = await axios.get(`${API_URL}report/voice-of-customer/competition-info?companyId=${selectedCompanyId}${!salespersonFilter ? '' : `&salesPersonDocId=${salespersonFilter}`}${!industryId? '':`&industryId=${industryId}`}${!customerTypeId? '':`&customerTypeId=${customerTypeId}`}${!province? '':`&province=${province}`}${!customerId? '':`&customerId=${customerId}`}`);
            // to use, data is returned as payloadResult
            if (competitionInfoRes.status === 200 || competitionInfoRes.status === 204) {
                const { report, status } = competitionInfoRes.data;
                dispatch({
                    type: SET_COMPETITION_STATE,
                    payload: { competitionInfo: status, report }
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
                type: SET_COMPETITION_STATE,
                payload: { loading: false }
            });
        }
    }
}

export const exportCompetitionInformation = () : AppThunk => {
    return async (dispatch, getState) => {
        const { userDetails } = getState().system.session;
        const { salesPersonDocId, province, customerTypeId, industryId, selectedCompanyId, customerId } = getState().competitionState;
        dispatch({
            type: SET_COMPETITION_STATE,
            payload: { loading: true }
        });
        try {
            const salespersonFilter = (userDetails.role as string).toLowerCase() === 'sales engineer' ? `${userDetails.id}` : salesPersonDocId;
            const competitionInfoRes = await axios.get(`${API_URL}report/voice-of-customer/competition-info/export?companyId=${selectedCompanyId}${!salespersonFilter ? '' : `&salesPersonDocId=${salespersonFilter}`}${!industryId? '':`&industryId=${industryId}`}${!customerTypeId? '':`&customerTypeId=${customerTypeId}`}${!province? '':`&province=${province}`}${!customerId? '':`&customerId=${customerId}`}`, {
                responseType: 'blob'
            });
            // to use, data is returned as payloadResult
            if (competitionInfoRes.status === 200 || competitionInfoRes.status === 204) {
                if (competitionInfoRes.status === 200 || competitionInfoRes.status === 204) {
                    const url = window.URL.createObjectURL(new Blob([competitionInfoRes.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', 'report.xlsx');
                    document.body.appendChild(link);
                    link.click();
                }
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
                type: SET_COMPETITION_STATE,
                payload: { loading: false }
            });
        }
    }
}