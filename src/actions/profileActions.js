import axios from 'axios';

import {
    GET_ERRORS,
    SET_USER_PROFILE
} from '../constants/actions';

export function setCurrentProfile(data) {
    return {
        type: SET_USER_PROFILE,
        payload: data,
    };
}

export const getProfile = (data) => dispatch => {
    axios
        .post('/api/v1/dev/profile/getprofile', data)
        .then((res) => {
            if(res.data.msg) {
                dispatch(setCurrentProfile({}));
            } else {
                dispatch(setCurrentProfile(res.data));
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
export const updateProfile = (data, type) => dispatch => {
    const url = type === 'add' ? '/api/v1/dev/profile/fill-profile' : '/api/v1/dev/profile/update-profile';
    axios
        .post(url, data)
        .then((res) => {
            if(res.data.msg) {
                dispatch(setCurrentProfile({}));
            } else {
                dispatch(setCurrentProfile(res.data));
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