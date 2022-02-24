import {
    TypeOfEntriesAction,
    TypeOfEntriesCustomerTypeFilter,
    TypeOfEntriesIndustryFilter,
    TypeOfEntriesProvinceFilter,
    TypeOfEntriesSalesPersonDocIdFilter,
    SET_TYPE_OF_ENTRIES_STATE,
    TypeOfEntriesDatePeriodFilter,
    TypeOfEntriesState,
    SetTESelectedCompanyFilter
} from './types';
import { 
    ALERT_STATE
} from '../../../alert/types';
import { SystemState } from '../../../system/types';
import { AppThunk } from '../../..';
import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;


export const setTECompanyFilter = (data: SetTESelectedCompanyFilter): TypeOfEntriesAction => ({
    type : SET_TYPE_OF_ENTRIES_STATE,
    payload: { ...data, salesPersonDocId: "", province: "", industryId: "", customerTypeId: "", datePeriod: 'YearToDate' }
});

export const getTypeOfEntries = (system: SystemState, info: TypeOfEntriesState) : AppThunk => {
    return async (dispatch) => {
        const { token, userDetails } = system.session;
        const { salesPersonDocId, province, customerTypeId, industryId, datePeriod, selectedCompanyId } = info;
        dispatch({
            type: SET_TYPE_OF_ENTRIES_STATE,
            payload: { loading: true, typeOfEntriesInfo: { Monthly: {},YearToDate: {}} }
        });
        try {
            const salespersonFilter = (userDetails.role as string).toLowerCase() === 'sales engineer' ? `${userDetails.id}` : salesPersonDocId;
            const payloadResult = await axios.get(`${API_URL}report/voice-of-customer/type-of-entries?datePeriod=${datePeriod}&companyId=${selectedCompanyId}${!salespersonFilter? '' : `&salesPersonDocId=${salespersonFilter}`}${!industryId? '':`&industryId=${industryId}`}${!customerTypeId? '':`&customerTypeId=${customerTypeId}`}${!province? '':`&province=${province}`}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            // to use, data is returned as payloadResult
            if (payloadResult.status === 200 || payloadResult.status === 204) {
                dispatch({
                    type: SET_TYPE_OF_ENTRIES_STATE,
                    payload: { typeOfEntriesInfo: {...payloadResult.data} }
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
                type: SET_TYPE_OF_ENTRIES_STATE,
                payload: { loading: false }
            });
        }
    }
}

export const setSalesPersonDocIdFilter = (data: TypeOfEntriesSalesPersonDocIdFilter): TypeOfEntriesAction => ({
    type : SET_TYPE_OF_ENTRIES_STATE,
    payload: data
});

export const setProvinceFilter = (data: TypeOfEntriesProvinceFilter): TypeOfEntriesAction => ({
    type : SET_TYPE_OF_ENTRIES_STATE,
    payload: data
});

export const setIndustryFilter = (data: TypeOfEntriesIndustryFilter): TypeOfEntriesAction => ({
    type : SET_TYPE_OF_ENTRIES_STATE,
    payload: data
});

export const setCustomerTypeFilter = (data: TypeOfEntriesCustomerTypeFilter): TypeOfEntriesAction => ({
    type : SET_TYPE_OF_ENTRIES_STATE,
    payload: data
});

export const setDatePeriodFilter = (data: TypeOfEntriesDatePeriodFilter): TypeOfEntriesAction => ({
    type : SET_TYPE_OF_ENTRIES_STATE,
    payload: data
});