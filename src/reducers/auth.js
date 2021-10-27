import isEmpty from 'is-empty';
import {
    USER_LOGOUT,
    SET_CURRENT_USER,
    DATA_LOADING,
    DATA_FETCHED,
    SET_USER_PROFILE,
    PWD_UPDATED,
    SET_TWO_FACTOR,
} from '../constants/actions';

const INITIAL_STATE = {
    authenticated: false,
    test: "NO",
    fetching: false,
    registerResponse: null,
    twoFactor: null,
    roleList: null,
    userList: null,
    roleDetail: null,
    userData: {},
    userProfile: {},
    existProfile: false,
    isPwdUpdated: false,
    pwdUpdateSuccess: '',
};

export default function auth (state = INITIAL_STATE, action) {
    switch (action.type) {
        case SET_CURRENT_USER: {
            return {
                ...state,
                authenticated: !isEmpty(action.payload),
                userData: action.payload,
                twoFactor: action.payload.twoFactor
            };
        }
        case DATA_LOADING: {
            return {
                ...state,
                fetching: true,
                test: "YES"
            }
        }
        case DATA_FETCHED: {
            return {
                ...state,
                fetching: false,
                test: "NO"
            }
        }
        case USER_LOGOUT: {
            return {
                ...state,
                authenticated: false,
                userData: {}
            };
        }
        case SET_USER_PROFILE: {
            return {
                ...state,
                userProfile: action.payload,
                existProfile: !isEmpty(action.payload),
            };
        }
        case PWD_UPDATED: {
            return {
                ...state,
                isPwdUpdated: action.payload === 'success' ? true : false,
                pwdUpdateSuccess: action.payload
            };
        }
        case SET_TWO_FACTOR: {
            return {
                ...state,
                twoFactor: action.payload
            };
        }
        default:
            return state;
    }
}