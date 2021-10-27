/* eslint-disable import/no-anonymous-default-export */
import {combineReducers} from 'redux';
import auth from './auth';
import errorReducers from './errorReducers';
import bank from './bank';
export default combineReducers({
    auth: auth,
    errors: errorReducers,
    bank: bank,
});