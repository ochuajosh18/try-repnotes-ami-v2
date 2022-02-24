import {
    MarketAction,
    MarketDetails,
    MarketReportStateInput,
    SET_MARKET_STATE
} from './types';
import { 
    ALERT_STATE
} from '../../alert/types';
import { SystemState } from '../../system/types';
import { AppThunk } from '../..';
import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;

export const setMarketReportState = (state: MarketReportStateInput): MarketAction => ({
    type: SET_MARKET_STATE,
    payload: state
});

export const resetFilter = (state: Array<string>): AppThunk => (dispatch) => {
    state.forEach(filter => {
        dispatch({
            type: SET_MARKET_STATE,
            payload: { [filter]: '' }
        });
    });
};

export const getMarketProductFamilyList = (): AppThunk => {
    return async (dispatch, getState) => {
        const { token, userDetails } = getState().system.session;
        const { selectedCompanyId } = getState().marketState;
        dispatch({
            type: SET_MARKET_STATE,
            payload: { loading: true, marketProductFamilyList: [] }
        });
        try {
            const payloadResult = await axios.get(`${API_URL}report/market-share/filter/productFamily?companyId=${selectedCompanyId ? selectedCompanyId:userDetails.companyId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            // to use, data is returned as payloadResult
            if (payloadResult.status === 200 || payloadResult.status === 204) {
                dispatch({
                    type: SET_MARKET_STATE,
                    payload: { marketProductFamilyList: [...payloadResult.data] }
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
                type: SET_MARKET_STATE,
                payload: { loading: false }
            });
        }
    }
}

export const getMarketInfo = () : AppThunk => {
    return async (dispatch, getState) => {
        const { userDetails } = getState().system.session;
        const { productFamilyId, selectedSalespersonId, selectedCompanyId } = getState().marketState;
        dispatch({
            type: SET_MARKET_STATE,
            payload: { loading: true, rollingYear: '', marketSize: 0, unitSales: 0, rollingMarketSize: {},rollingUnitSales: {}, rollingShare: {}  }
        });
        try {

            const marketReportRes = await axios.get(`${API_URL}report/market-share?companyId=${selectedCompanyId ? selectedCompanyId:userDetails.companyId}${!productFamilyId? '':`&productFamily=${productFamilyId}`}${!selectedSalespersonId ? '' : `&salesman=${selectedSalespersonId}`}`);
            // // to use, data is returned as payloadResult
            if (marketReportRes.status === 200 || marketReportRes.status === 204) {
                const { status, report } = marketReportRes.data;
                const { rollingYear, marketSize, unitSales, rollingMarketSize, rollingUnitSales, rollingShare } = status;
                dispatch({
                    type: SET_MARKET_STATE,
                    payload: { 
                        rollingYear,
                        marketSize,
                        unitSales,
                        rollingMarketSize,
                        rollingUnitSales,
                        rollingShare,
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
                type: SET_MARKET_STATE,
                payload: { loading: false }
            });
        }
    }
}

export const clearImportDialog = (): MarketAction => ({
    type : SET_MARKET_STATE,
    payload: { dialogOpen: false, marketList: [] }
});

export const importMarketData = (system: SystemState, file: File | any, companyId?: string ): AppThunk => {
    return async (dispatch) => {
        const { token } = system.session;
        if(companyId !== ""){
            dispatch({
                type: SET_MARKET_STATE,
                payload: { loading: true, marketList: [] }
            });
            try {
                let formData = new FormData()
                formData.append('uploads[]', file[0], file[0].name)
                const payloadResult = await axios.post(`${API_URL}media/excel/upload/market`, formData, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                // to use, data is returned as payloadResult
                if (payloadResult.status === 200 || payloadResult.status === 204) {
                    dispatch({
                        type: SET_MARKET_STATE,
                        payload: { marketList: [...(payloadResult.data as Array<MarketDetails>).filter(item => item.period !== '' && item)] }
                    });
                    if(payloadResult.data.length > 0){
                        dispatch({
                            type: SET_MARKET_STATE,
                            payload: { dialogOpen: true }
                        });
                    }
                }
            }catch(err){
                let msg = "";
                console.log(err)
                err.response.status === 409 ? msg = err.response.data.message : msg = err.response.data.error.message;
                dispatch({
                    type: ALERT_STATE,
                    payload: {alertOpen: true, alertMessage: msg.split(':').pop(), alertType: 'error'}
                });
            }finally {
                dispatch({
                    type: SET_MARKET_STATE,
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
            type: SET_MARKET_STATE,
            payload: { uploadLoading: true }
        });
        try {
            const { marketList } = getState().marketState; // uncomment this to get filter data using destructuring
            const payloadResult = await axios.post(`${API_URL}report/market-share`, marketList);
            if (payloadResult.status === 200 || payloadResult.status === 204) {
                dispatch({
                    type: ALERT_STATE,
                    payload: { alertOpen : true, alertMessage: `Uploading Done! ${payloadResult.data.count} of ${marketList.length} uploaded.`, alertType: "success"  }
                });
                dispatch(getMarketInfo());
            }
        }catch(err){
        }finally {
            dispatch({
                type: SET_MARKET_STATE,
                payload: { uploadLoading: false, dialogOpen: false }
            });
        }
    }
}

/**
 * @description gets the excel document for market report data 
 * @returns the redux action that was called using Redux Thunk
 */
 export const exportMarketReport = (companyId?: string): AppThunk => async (dispatch, getState) => {
    dispatch({
        type: SET_MARKET_STATE,
        payload: { loading: true }
    });
    try {
        const { productFamilyId, selectedSalespersonId } = getState().marketState;
        const { session } = getState().system;
        const marketReportRes = await axios.get(`${API_URL}report/market-share/export?companyId=${companyId ? companyId: session.userDetails.companyId}${!productFamilyId? '':`&productFamily=${productFamilyId}`}${!selectedSalespersonId ? '' : `&salesman=${selectedSalespersonId}`}`, {
            responseType: 'blob'
        });
        if (marketReportRes.status === 200 || marketReportRes.status === 204) {
            const url = window.URL.createObjectURL(new Blob([marketReportRes.data]));
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
            type: SET_MARKET_STATE,
            payload: { loading: false }
        });
    }
}