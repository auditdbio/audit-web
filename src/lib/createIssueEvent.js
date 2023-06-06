export const createIssueEvent = values => {
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
      events.push({
        kind: 'StatusChange',
        message: `changed status`,
      });
    } else if (keys[0] === 'severity') {
      events.push({
        kind: 'IssueSeverity',
        message: `changed severity to ${values.severity}`,
      });
    } else if (keys[0] === 'category') {
      events.push({
        kind: 'IssueCategory',
        message: `changed category to ${values.category}`,
      });
    } else if (keys[0] === 'description') {
      events.push({
        kind: 'IssueDescription',
        message: 'changed description',
      });
    } else if (keys[0] === 'link') {
      events.push({
        kind: 'IssueLink',
        message: values.link ? 'added new link' : 'deleted link',
      });
    }
  }

  return { ...values, events };
};
