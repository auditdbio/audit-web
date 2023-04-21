import {
    CLEAR_MESSAGES,
    ERROR_CONTACT_MESSAGE,
    SEND_CONTACT_MESSAGE,
} from "../actions/types.js";

const initialState = {
    data: null,
    error: null,
    successMessage: null,
    errorMessage: null
}

export const contactUsReducer = (state = initialState, action) => {
    switch (action.type) {
        case SEND_CONTACT_MESSAGE:
            return {...state, data: action.payload, successMessage: 'Message sent successfully', errorMessage: null}
        case ERROR_CONTACT_MESSAGE:
            return {...state, successMessage: null, errorMessage: 'Sorry, an error occurred while submitting your form'}
        case CLEAR_MESSAGES:
            return {...state, successMessage: null, errorMessage: null}
        default:
            return state
    }
}