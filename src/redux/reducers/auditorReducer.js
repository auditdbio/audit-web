import {
    GET_AUDITOR, UPDATE_AUDITOR,

} from "../actions/types.js";

const initialState = {
    auditor: null,
    error: null
}
export const auditorReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_AUDITOR:
            return {...state, auditor: action.payload}
        case UPDATE_AUDITOR:
            return {...state, auditor: action.payload}
        default:
            return state
    }
}