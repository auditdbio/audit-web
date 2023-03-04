import {applyMiddleware, combineReducers, createStore} from "redux";
import {composeWithDevTools} from "redux-devtools-extension/developmentOnly";
import thunk from "redux-thunk";
import {userReducer} from "./reducers/userReducer";
import {customerReducer} from "./reducers/customerReducer.js";
import {auditorReducer} from "./reducers/auditorReducer.js";

export const store = createStore(combineReducers({
    user: userReducer,
    customer: customerReducer,
    auditor: auditorReducer,
}), composeWithDevTools(applyMiddleware(thunk)))