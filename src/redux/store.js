import { applyMiddleware, combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import thunk from 'redux-thunk';
import websocketMiddleware from './middleware/websocketMiddleware.js';
import { userReducer } from './reducers/userReducer';
import { customerReducer } from './reducers/customerReducer.js';
import { auditorReducer } from './reducers/auditorReducer.js';
import { projectReducer } from './reducers/projectReducer.js';
import { auditReducer } from './reducers/auditReducer.js';
import { contactUsReducer } from './reducers/contactUsReducer.js';
import { websocketReducer } from './reducers/websocketReducer.js';
import { issueReducer } from './reducers/issueReducer.js';
import { notFoundReducer } from './reducers/notFoundReducer.js';
import { chatReducer } from './reducers/chatReducer.js';

export const store = createStore(
  combineReducers({
    user: userReducer,
    project: projectReducer,
    customer: customerReducer,
    auditor: auditorReducer,
    audits: auditReducer,
    issues: issueReducer,
    contactUs: contactUsReducer,
    websocket: websocketReducer,
    notFound: notFoundReducer,
    chat: chatReducer,
  }),
  composeWithDevTools(applyMiddleware(thunk, websocketMiddleware())),
);
