import {
    SET_BANK_LIST,
} from '../constants/actions';

const INITIAL_STATE = {
    fetching: false,
    fetched: false,
    banks: [],
};

export default function bank (state = INITIAL_STATE, action) {
    switch (action.type) {
        case SET_BANK_LIST: {
            if (action.payload.length !== 0) {
                var banks = []; 
                action.payload.forEach(e => {
                    banks.push(e);
                });
            } else {
                return {state};    
            }
            return {
                ...state,
                banks: banks
            };
        }
        default:
            return state;
    }
}
