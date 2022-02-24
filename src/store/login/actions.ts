import {
    LOGIN_INPUT,
    LoginInput,
    LoginAction,
    LOGIN_SUCCESS,
    LOGIN_FAILED,
    LOGIN_REQUEST,
    LoginState
} from './types'
import { ALERT_STATE } from '../alert/types';
import { SET_SYSTEM_STATE, SET_SESSION } from '../system/types';
import { AppThunk } from '..';
import { setInterceptor } from '../system/actions';
import axios from 'axios';

export const loginInput = (login: LoginInput): LoginAction => ({
    type : LOGIN_INPUT,
    payload: login
});

export const authenticateUser = (login: LoginState): AppThunk => {
    return async (dispatch, getState) => {
        dispatch({
            type: LOGIN_REQUEST,
            payload: {...login, loading: true}
        });
        try {
            const { REACT_APP_API_URL, REACT_APP_TOKEN } = process.env
            const { username, password, rememberMe } = login
            const loginRes = await axios.post(`${REACT_APP_API_URL}user/login`, {'username' : username, 'password' : password}, {
                headers: {
                    'Authorization': `Bearer ${REACT_APP_TOKEN}`
                }
            });
            // to use, data is returned as prodRes.data
            if (loginRes.status === 200) {
                dispatch(setInterceptor(loginRes.data.token));
                dispatch({
                    type: SET_SESSION,
                    payload: { ...loginRes.data, isLoggedIn: true, modules: loginRes.data.userDetails.modules }
                });
                dispatch({
                    type: LOGIN_SUCCESS,
                    payload: {...login, loading: false, rememberMe: rememberMe ? rememberMe : false}
                });
                dispatch({
                    type: SET_SYSTEM_STATE,
                    payload: { rememberUser: getState().login.rememberMe }
                });
            }
        }catch(err){
            if (err.response) {
                let msg = err.response.data.error.message
                
                msg = msg.split(':').pop();
                dispatch({
                    type: LOGIN_FAILED,
                    payload: {...login, loading: false}
                });
                dispatch({
                    type: ALERT_STATE,
                    payload: {alertOpen : true, alertMessage: msg, alertType: 'error'}
                });
            }
            else {
                dispatch({
                    type: ALERT_STATE,
                    payload: {alertOpen : true, alertMessage: 'Something went wrong. Please contact the adminintrator', alertType: 'error'}
                });
            }
        }
    }
}

