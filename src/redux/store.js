import {applyMiddleware, combineReducers, createStore} from "redux";
import {composeWithDevTools} from "redux-devtools-extension/developmentOnly";
import thunk from "redux-thunk";
import {userReducer} from "./reducers/userReducer";

export const store = createStore(combineReducers({
    user: userReducer
}), composeWithDevTools(applyMiddleware(thunk)))