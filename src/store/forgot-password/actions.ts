import {
    ForgotPasswordAction,
    ForgotPasswordInput,
    FORGOT_PASSWORD_INPUT,
    FORGOT_PASSWORD_REQUEST,
    RESET_TIMER,
    START_TIMER
} from './types'
import { 
    ALERT_STATE
} from '../alert/types';
import axios from 'axios';
import { AppThunk } from '..';

export const forgotPasswordInput = (forgotPassword: ForgotPasswordInput): ForgotPasswordAction => ({
    type : FORGOT_PASSWORD_INPUT,
    payload: forgotPassword
});

export const sendEmailForgotPassword = (forgotPassword: ForgotPasswordInput): AppThunk => {
    return async (dispatch) => {
        const { REACT_APP_API_URL, REACT_APP_FORGOT_PASSWORD_TOKEN } = process.env
        const { email } = forgotPassword
        var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
        if(pattern.test(`${email}`) && email !== '') {
            dispatch({
                type: FORGOT_PASSWORD_REQUEST,
                payload: { loading: true }
            });
            try {
                const loginRes = await axios.post(`${REACT_APP_API_URL}user/forgotPassword`, {'email' : email}, {
                    headers: {
                        'Authorization': `Bearer ${REACT_APP_FORGOT_PASSWORD_TOKEN}`
                    }
                });
                // to use, data is returned as prodRes.data
                if (loginRes.status === 200 || loginRes.status === 204) {
                    dispatch({
                        type: ALERT_STATE,
                        payload: {alertOpen : false, alertMessage: 'Your temporary password is sent to your email.', alertType: 'success'}
                    });
                    dispatch({
                        type: FORGOT_PASSWORD_REQUEST,
                        payload: { loading: false }
                    });
                }
            }catch(err){
                let msg = err.response.data.error.message
                msg = msg.split(':').pop();
                dispatch({
                    type: ALERT_STATE,
                    payload: {alertOpen: true, alertMessage: msg, alertType: 'error'}
                });
                dispatch({
                    type: FORGOT_PASSWORD_REQUEST,
                    payload: { loading: false }
                });
            }
        }
        else{
            dispatch({
                type: ALERT_STATE,
                payload: {alertOpen: true, alertMessage: 'Email is not Valid', alertType: 'warning'}
            });
        }
    }
}

export const startTimer = (): ForgotPasswordAction => {
    return {
        type: START_TIMER,
        payload: { startTimer: true }
    }
}

export const timerIsRunning = (): ForgotPasswordAction => {
    return {
        type: ALERT_STATE,
        payload: {alertOpen: true, alertMessage: 'Resend disabled. Try after a minute.', alertType: 'warning'}
    }
}

export const resetTimer = (): ForgotPasswordAction => {
    return {
        type: RESET_TIMER
    }
}

export const resendEmailForgotPassword = (forgotPassword: ForgotPasswordInput): AppThunk => {
    return async (dispatch) => {
        const { REACT_APP_API_URL, REACT_APP_FORGOT_PASSWORD_TOKEN } = process.env
        const { email } = forgotPassword
        try {
            const loginRes = await axios.post(`${REACT_APP_API_URL}user/forgotPassword`, {'email' : email}, {
                headers: {
                    'Authorization': `Bearer ${REACT_APP_FORGOT_PASSWORD_TOKEN}`
                }
            });
            // to use, data is returned as prodRes.data
            if (loginRes.status === 200 || loginRes.status === 204) {
                dispatch({
                    type: ALERT_STATE,
                    payload: {alertOpen : true, alertMessage: 'Resend successful, Please check your email for you temporary password.', alertType: 'success'}
                });
                dispatch({
                    type: START_TIMER,
                    payload: { startTimer: true }
                })
            }
        }catch(err){
            let msg = err.response.data.error.message
            msg = msg.split(':').pop();
            dispatch({
                type: ALERT_STATE,
                payload: {alertOpen: true, alertMessage: msg, alertType: 'error'}
            });
        }
    }
}

