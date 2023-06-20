import React, { useEffect, useState, useRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { addSpacesToCamelCase, addTestsLabel } from '../../lib/helper.js';
import { Box, Link, Tooltip, Typography, Zoom } from '@mui/material';
import IssueSeverity from './IssueSeverity.jsx';
import theme from '../../styles/themes.js';

const IssueListItem = ({ issue, auditId }) => {
  const [showTitleTooltip, setShowTitleTooltip] = useState(false);
  const titleBoxRef = useRef();
  const titleTextRef = useRef();

  useEffect(() => {
    const boxHeight = titleBoxRef.current?.offsetHeight;
    const titleElement = titleBoxRef.current?.querySelector('span');
    const titleHeight = titleElement?.offsetHeight;
    if (titleHeight > boxHeight) {
      setShowTitleTooltip(true);
    }
  }, []);

  return (
    <Link
      sx={issueRow}
      component={RouterLink}
      onClick={() => window.scrollTo({ top: 0 })}
      to={`/issues/audit-issue/${auditId}/${issue.id}`}
      {...addTestsLabel('issue-details-link')}
    >
      <Tooltip
        title={showTitleTooltip ? issue.name : ''}
        arrow
        placement="top"
        TransitionComponent={Zoom}
        enterDelay={300}
        leaveDelay={0}
      >
        <Typography sx={[columnText, issueTitleSx]} ref={titleBoxRef}>
          <span ref={titleTextRef}>{issue.name}</span>
        </Typography>
      </Tooltip>
      <Typography sx={[columnText, statusSx(issue.status)]}>
        {addSpacesToCamelCase(issue.status)}
      </Typography>
      <Box sx={severityWrapper}>
        <IssueSeverity text={issue.severity} />
      </Box>
    </Link>
  );
};

export default IssueListItem;

const issueRow = theme => ({
  display: 'flex',
  width: '100%',
  padding: '30px 0',
  textDecoration: 'none',
  cursor: 'pointer',
  border: '2px solid #E5E5E5',
  borderBottom: 'none',
  '&:last-child': { borderBottom: '2px solid #E5E5E5' },
  ':hover': { backgroundColor: '#F1F1F1' },
  [theme.breakpoints.down('xs')]: {
    justifyContent: 'space-between',
    padding: '15px 10px 15px 0',
  },
});

const columnText = theme => ({
  color: '#434242',
  fontSize: '20px',
  fontWeight: 500,
  lineHeight: '25px',
  padding: '0 25px',
  [theme.breakpoints.down('lg')]: {
    fontSize: '18px',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '16px',
  },
  [theme.breakpoints.down('xs')]: {
    padding: '0 15px',
  },
});

const issueTitleSx = {
  display: '-webkit-box',
  maxHeight: '50px',
  overflow: 'hidden',
  wordBreak: 'break-word',
  width: '70%',
  alignSelf: 'center',
  '-webkit-line-clamp': '2',
  '-webkit-box-orient': 'vertical',
  'text-overflow': 'ellipsis',
};

const statusSx = status => {
  let color = '#434242';
  if (status === 'Draft') color = '#52176D';
  if (status === 'Verification' || status === 'InProgress') color = '#5b97bb';
  if (status === 'Fixed' || status === 'WillNotFix') color = '#09C010';

  return {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    padding: '0 !important',
    width: '15%',
    letterSpacing: '-1px',
    color,
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  };
};

const severityWrapper = {
  width: '15%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};
