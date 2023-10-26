import {
  ADD_AUDIT_ISSUE,
  CLEAR_MESSAGES,
  DISCLOSE_ALL_ISSUES,
  GET_AUDIT_ISSUES,
  REQUEST_ERROR,
  SET_READ_CHANGES,
  UPDATE_AUDIT_ISSUE,
} from '../actions/types.js';

const initialState = {
  issuesAuditId: null,
  issues: [],
  error: null,
  successMessage: null,
};

export const issueReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_AUDIT_ISSUES:
      return {
        ...state,
        issuesAuditId: action.payload.auditId,
        issues: action.payload.issues,
      };
    case ADD_AUDIT_ISSUE:
      return {
        ...state,
        successMessage: 'Audit issue created successfully',
        issues: [...state.issues, action.payload.issue],
      };
    case UPDATE_AUDIT_ISSUE:
      return {
        ...state,
        successMessage: 'Changes saved successfully',
        issues: state.issues?.map(issue =>
          issue.id === action.payload.issue.id ? action.payload.issue : issue,
        ),
      };
    case DISCLOSE_ALL_ISSUES:
      return {
        ...state,
        issues: action.payload,
        successMessage: 'All issues disclosed',
      };
    case REQUEST_ERROR:
      return { ...state, error: 'Error while processing request' };
    case CLEAR_MESSAGES:
      return { ...state, error: null, successMessage: null };
    case SET_READ_CHANGES:
      const { issueId, readCount } = action.payload;
      return {
        ...state,
        issues: state.issues?.map(issue =>
          issue.id === issueId ? { ...issue, read: readCount } : issue,
        ),
      };
    default:
      return state;
  }
};