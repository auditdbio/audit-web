import {
  BEGIN_ACTION,
  DISCARD_ACTION,
  DRAFT,
  FIXED,
  FIXED_ACTION,
  NOT_FIXED,
  NOT_FIXED_ACTION,
  REOPEN_ACTION,
  VERIFICATION,
  VERIFIED_ACTION,
  IN_PROGRESS,
} from '../components/issuesPage/constants.js';

const getStatusLabel = (action, currentStatus) => {
  if (currentStatus === DRAFT && action === BEGIN_ACTION) {
    return IN_PROGRESS;
  }
  if (currentStatus === IN_PROGRESS && action === FIXED_ACTION) {
    return VERIFICATION;
  }
  if (currentStatus === IN_PROGRESS && action === DISCARD_ACTION) {
    return NOT_FIXED;
  }
  if (currentStatus === VERIFICATION && action === VERIFIED_ACTION) {
    return FIXED;
  }
  if (currentStatus === VERIFICATION && action === NOT_FIXED_ACTION) {
    return IN_PROGRESS;
  }
  if (currentStatus === VERIFICATION && action === FIXED_ACTION) {
    return IN_PROGRESS;
  }
  if (currentStatus === FIXED && action === VERIFIED_ACTION) {
    return VERIFICATION;
  }
  if (currentStatus === NOT_FIXED && action === REOPEN_ACTION) {
    return IN_PROGRESS;
  }

  return 'new';
};

export const createIssueEvent = (
  values,
  prevLinksLength,
  currentStatus,
  feedback,
) => {
  const events = [];
  const keys = Object.keys(values);

  if (keys.length > 1) {
    events.push({
      kind: 'IssueDescription',
      message: 'changed the issue data',
    });
  } else if (keys.length) {
    if (keys[0] === 'name') {
      events.push({
        kind: 'IssueName',
        message: 'changed name of the issue',
      });
    } else if (keys[0] === 'status') {
      const newStatus = getStatusLabel(values.status, currentStatus);
      events.push({
        kind: 'StatusChange',
        message: `changed status to ${newStatus}`,
      });
    } else if (keys[0] === 'severity') {
      events.push({
        kind: 'IssueSeverity',
        message: `${values.severity}`,
      });
    } else if (keys[0] === 'category') {
      events.push({
        kind: 'IssueCategory',
        message: `changed category to '${values.category}'`,
      });
    } else if (keys[0] === 'description') {
      events.push({
        kind: 'IssueDescription',
        message: 'changed description',
      });
    } else if (keys[0] === 'links') {
      events.push({
        kind: 'IssueLink',
        message:
          prevLinksLength <= values.links?.length
            ? 'added new link'
            : 'deleted link',
      });
    } else if (keys[0] === 'feedback') {
      events.push({
        kind: feedback ? 'FeedbackChanged' : 'FeedbackAdded',
        message: feedback ? 'changed feedback' : 'added feedback',
      });
    }
  }

  return { ...values, events };
};
