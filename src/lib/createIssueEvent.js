const getStatusLabel = (action, currentStatus) => {
  if (currentStatus === 'Draft' && action === 'Begin') {
    return 'InProgress';
  }
  if (currentStatus === 'InProgress' && action === 'Fixed') {
    return 'Verification';
  }
  if (currentStatus === 'InProgress' && action === 'Discard') {
    return 'NotFixed';
  }
  if (currentStatus === 'Verification' && action === 'Verified') {
    return 'Fixed';
  }
  if (currentStatus === 'Verification' && action === 'NotFixed') {
    return 'InProgress';
  }
  if (currentStatus === 'Fixed' && action === 'Verified') {
    return 'Verification';
  }
  if (currentStatus === 'NotFixed' && action === 'ReOpen') {
    return 'InProgress';
  }
  if (currentStatus === 'Verification' && action === 'Fixed') {
    return 'InProgress';
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
