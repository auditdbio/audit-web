import { applyMiddleware, combineReducers, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";
import thunk from "redux-thunk";
import { userReducer } from "./reducers/userReducer";
import { customerReducer } from "./reducers/customerReducer.js";
import { auditorReducer } from "./reducers/auditorReducer.js";
import { projectReducer } from "./reducers/projectReducer.js";

export const store = createStore(
  combineReducers({
    user: userReducer,
    project: projectReducer,
    customer: customerReducer,
    auditor: auditorReducer,
  }),
  composeWithDevTools(applyMiddleware(thunk))
);
