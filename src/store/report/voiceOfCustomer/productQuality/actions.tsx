import {
    ProductQualityAction,
    SET_PRODUCT_QUALITY_STATE,
    DynamicProductQualityInputInterface,
    DynamicProductQualityType
} from './types';
import { 
    ALERT_STATE
} from '../../../alert/types';
import { AppThunk } from '../../..';
import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;

export const setProductQualityState = (state: DynamicProductQualityInputInterface<DynamicProductQualityType>): ProductQualityAction => ({
    type: SET_PRODUCT_QUALITY_STATE,
    payload: state
});

export const resetFilter = (state: Array<string>): AppThunk => (dispatch) => {
    state.forEach(filter => {
        dispatch({
            type: SET_PRODUCT_QUALITY_STATE,
            payload: { [filter]: '' }
        });
    });
};

export const getProductQuality = () : AppThunk => {
    return async (dispatch, getState) => {
        const { userDetails } = getState().system.session;
        const { salesPersonDocId, province, customerTypeId, industryId, selectedCompanyId, modelId, customerId, productFamilyId, rating, viewType } = getState().productQualityState;
        dispatch({
            type: SET_PRODUCT_QUALITY_STATE,
            payload: { loading: true, productQuality: {} }
        });
        try {
            const salespersonFilter = (userDetails.role as string).toLowerCase() === 'sales engineer' ? `${userDetails.id}` : salesPersonDocId;
            const productQualityRes = await axios.get(`${API_URL}report/voice-of-customer/product-quality?companyId=${selectedCompanyId}${!salespersonFilter? '' : `&salesPersonDocId=${salespersonFilter}`}${!industryId? '':`&industryId=${industryId}`}${!customerTypeId? '':`&customerTypeId=${customerTypeId}`}${!province? '':`&province=${province}`}${!modelId? '':`&modelId=${modelId}`}${!customerId? '':`&customerId=${customerId}`}${!productFamilyId? '':`&productFamilyId=${productFamilyId}`}${!rating? '':`&rating=${rating}`}${!viewType? '':`&viewType=${viewType}`}`);
            // to use, data is returned as payloadResult
            if (productQualityRes.status === 200 || productQualityRes.status === 204) {
                const { report, status } = productQualityRes.data;
                dispatch({
                    type: SET_PRODUCT_QUALITY_STATE,
                    payload: { productQuality: status, report }
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
                type: SET_PRODUCT_QUALITY_STATE,
                payload: { loading: false }
            });
        }
    }
}

export const exportProductQuality = () : AppThunk => {
    return async (dispatch, getState) => {
        const { userDetails } = getState().system.session;
        const { salesPersonDocId, province, customerTypeId, industryId, selectedCompanyId, modelId, customerId, productFamilyId, rating } = getState().productQualityState;
        dispatch({
            type: SET_PRODUCT_QUALITY_STATE,
            payload: { loading: true }
        });
        try {
            const salespersonFilter = (userDetails.role as string).toLowerCase() === 'sales engineer' ? `${userDetails.id}` : salesPersonDocId;
            const productQualityRes = await axios.get(`${API_URL}report/voice-of-customer/product-quality/export?companyId=${selectedCompanyId}${!salespersonFilter? '' : `&salesPersonDocId=${salespersonFilter}`}${!industryId? '':`&industryId=${industryId}`}${!customerTypeId? '':`&customerTypeId=${customerTypeId}`}${!province? '':`&province=${province}`}${!modelId? '':`&modelId=${modelId}`}${!customerId? '':`&customerId=${customerId}`}${!productFamilyId? '':`&productFamilyId=${productFamilyId}`}${!rating? '':`&rating=${rating}`}`, {
                responseType: 'blob'
            });
            // to use, data is returned as payloadResult
            if (productQualityRes.status === 200 || productQualityRes.status === 204) {
                const url = window.URL.createObjectURL(new Blob([productQualityRes.data]));
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
                type: SET_PRODUCT_QUALITY_STATE,
                payload: { loading: false }
            });
        }
    }
}