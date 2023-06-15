export const createIssueEvent = (values, prevLinksLength) => {
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
        message: `${values.severity}`,
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
    } else if (keys[0] === 'links') {
      events.push({
        kind: 'IssueLink',
        message:
          prevLinksLength < values.links?.length
            ? 'added new link'
            : 'deleted link',
      });
    }
  }

  return { ...values, events };
};
