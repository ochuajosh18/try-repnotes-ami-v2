import {
    SET_PROFILE_STATE,
    ProfileStateInput,
    ProfileAction
} from './types';
import { ALERT_STATE } from '../alert/types';
import { AppThunk } from  '..';
import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;

export const setProfileState = (state: ProfileStateInput): ProfileAction => ({
    type: SET_PROFILE_STATE,
    payload: state
});

export const onChangePassword = (): AppThunk => async (dispatch, getState) => {
    const { system, profile } = getState();
    const { oldPassword, newPassword, confirmNewPassword } = profile;
    const { token } = system.session;
    dispatch({
        type: SET_PROFILE_STATE,
        payload: { settingsLoading: true }
    });
    try {
        const body = {
            id: system.session.userDetails.id,
            password: newPassword,
            confirmedPassword: confirmNewPassword,
            oldPassword: oldPassword
        }

        const changePassRes = await axios.post(`${API_URL}user/changePassword`, body, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (changePassRes.status === 204) {
            dispatch({
                type: ALERT_STATE,
                payload: { alertOpen: true, alertMessage: 'Password changed successfully', alertType: 'success' }
            });
            dispatch({
                type: SET_PROFILE_STATE,
                payload: { oldPassword: '', newPassword: '', confirmNewPassword: '' }
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
            type: SET_PROFILE_STATE,
            payload: { settingsLoading: false }
        });
    }
}