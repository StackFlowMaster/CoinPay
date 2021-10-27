import axios from 'axios';

import {
    GET_ERRORS,
    SET_APP_LIST
} from '../constants/actions';

export function setBankList(data) {
    return {
        type: SET_APP_LIST,
        payload: data,
    };
}

export const getBankList = (data) => dispatch => {
    axios
        .post('/api/v1/dev/bank/all', data)
        .then((res) => {
                dispatch(setBankList(res.data));
        })
        .catch(err => {
            console.error(err);
            dispatch({
                type: GET_ERRORS, 
                payload: err.response.data
            });
        });
}

export const removeBank = (data, callback) => dispatch => {
    axios
        .post('/api/v1/dev/bank/remove', data)
        .then((res => {
            if(res.status === 200) {
                callback('success');
            }
        }))
        .catch(err => {
            console.error(err);
            callback('failure');
        });
}

export const addBank = (data, callback) => dispatch => {
    axios
        .post('/api/v1/dev/bank/add', data)
        .then((res => {
            if(res.status === 200) {
                callback('success');
            }
        }))
        .catch(err => {
            console.error(err);
            callback('failure');
        });
}