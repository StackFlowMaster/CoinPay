import { GET_ERRORS } from '../constants/actions';
const initialState = {
    _errMsg: 'dreaet',
    _isErr: false
};
export default function errorReducers(state = initialState, action) {
    switch(action.type) {
        case GET_ERRORS:
            return {
                _errMsg: action.payload,
                _isErr: true,
            };
        default:
            return state;
    }
}