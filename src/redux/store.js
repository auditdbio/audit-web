import { applyMiddleware, combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import thunk from 'redux-thunk';
import { userReducer } from './reducers/userReducer';
import { customerReducer } from './reducers/customerReducer.js';
import { auditorReducer } from './reducers/auditorReducer.js';
import { projectReducer } from './reducers/projectReducer.js';
import { auditReducer } from './reducers/auditReducer.js';
import { contactUsReducer } from './reducers/contactUsReducer.js';
import websocketMiddleware from './middleware/websocketMiddleware.js';
import { websocketReducer } from './reducers/websocketReducer.js';
import { issueReducer } from './reducers/issueReducer.js';
import { notFoundReducer } from './reducers/notFoundReducer.js';
import { githubReducer } from './reducers/githubReducer.js';

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
    github: githubReducer,
  }),
  composeWithDevTools(applyMiddleware(thunk, websocketMiddleware())),
);
