import React from 'react';
import NameChangeIcon from '../icons/issueEvents/NameChangeIcon.jsx';
import DescriptionIcon from '../icons/issueEvents/DescriptionIcon.jsx';
import LinkChangeIcon from '../icons/issueEvents/LinkChangeIcon.jsx';
import CategoryChangeIcon from '../icons/issueEvents/CategoryChangeIcon.jsx';
import StatusChangeIcon from '../icons/issueEvents/StatusChangeIcon.jsx';
import SeverityChangeIcon from '../icons/issueEvents/SeverityChangeIcon.jsx';
import LabelEventIcon from '../icons/issueEvents/LabelEventIcon.jsx';
import CommentIcon from '../icons/issueEvents/CommentIcon.jsx';

const EventIcon = ({ kind }) => {
  if (kind === 'IssueName') return <NameChangeIcon />;

  if (kind === 'IssueSeverity') return <SeverityChangeIcon />;

  if (kind === 'IssueLink') return <LinkChangeIcon />;

  if (kind === 'IssueDescription') return <DescriptionIcon />;

  if (kind === 'IssueCategory') return <CategoryChangeIcon />;

  if (kind === 'StatusChange') return <StatusChangeIcon />;

  if (kind === 'FeedbackAdded' || kind === 'FeedbackChanged')
    return <CommentIcon />;

  return <LabelEventIcon />;
};

export default EventIcon;
