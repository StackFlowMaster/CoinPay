import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';
import jwt_decode from 'jwt-decode';
import {
    GET_ERRORS,
    USER_LOGOUT,
    SET_CURRENT_USER,
    PWD_UPDATED,
    DATA_LOADING,
    DATA_FETCHED,
    SET_TWO_FACTOR
} from '../constants/actions';

export function setCurrentUser (data) {
    return {
        type: SET_CURRENT_USER,
        payload: data
    };
}

export const logoutUser = () => dispatch => {
    localStorage.removeItem('jwtToken');
    setAuthToken(false);
    dispatch({
        type: USER_LOGOUT,
        payload: ''
    });
}
export const setTwoFactor = (data) => (dispatch) => {
    axios
        .post('/api/v1/dev/auth/settwofactor', data)
        .then((res) => {
            dispatch({
                type: SET_TWO_FACTOR,
                payload: data.status
            });
        })
        .catch(err => {
            console.error(err);
            dispatch({
                type: GET_ERRORS,
                payload: "set two factor error"
            });
        });
}
export const registerUser = (userData, history) => (dispatch) => {
    dispatch({
        type: DATA_LOADING,
        payload: ''
    });
    axios
        .post('/api/v1/dev/auth/register', userData)
        .then((res) => {
            if(res.data.msg) {
                dispatch({
                    type: GET_ERRORS,
                    payload: res.data.msg
                });
            } else {
                dispatch({
                    type: DATA_FETCHED,
                    payload: ''
                });
                if(userData.role === 'developer'){
                    history.push("/login-register");
                } else {
                    history.push("/admin/login");
                }
                // dispatch(setCurrentUser(res.data));
            }
        })
        .catch(err => {
            console.error(err);
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            });
        });
}

export const updatePwd =(data) => (dispatch) => {
    axios
        .post('/api/v1/dev/auth/reset-password', data)
        .then((res) => {
            if(res.data.msg === 'success') {
                dispatch({
                    type: PWD_UPDATED,
                    payload: 'success'
                });
            } else if (res.data.msg === 'not found') {
                dispatch({
                    type: PWD_UPDATED,
                    payload: 'error',
                });
            }
        })
        .catch(err => {
            console.error(err);
            dispatch({
                type: PWD_UPDATED,
                payload: 'error',
            });
        })
}

export const loginUser = (userData, history) => (dispatch) => {
    axios
        .post('/api/v1/dev/auth/login', userData)
        .then(res => {
            if(res.data.msg) {
                dispatch({
                    type: GET_ERRORS,
                    payload: res.data.msg
                });
            } else {
                const {token} = res.data;
                localStorage.setItem("jwtToken", token);
                setAuthToken(token);
                const decoded = jwt_decode(token);
                dispatch(setCurrentUser(decoded));
                // history.push('/admin/dashboard');
            }
        })
        .catch(err => {
            console.error(err);
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            });
        });
}