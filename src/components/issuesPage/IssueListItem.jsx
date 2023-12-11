import React, { useEffect, useState, useRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { addSpacesToCamelCase, addTestsLabel } from '../../lib/helper.js';
import { Box, Button, Link, Tooltip, Typography, Zoom } from '@mui/material';
import IssueSeverity from './IssueSeverity.jsx';
import theme from '../../styles/themes.js';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  DRAFT,
  FIXED,
  IN_PROGRESS,
  NOT_FIXED,
  VERIFICATION,
} from './constants.js';
import { useDispatch } from 'react-redux';
import {
  deleteIssue,
  deletePublicIssue,
} from '../../redux/actions/issueAction.js';

const IssueListItem = ({ issue, auditId, user, isPublic, saved }) => {
  const [showTitleTooltip, setShowTitleTooltip] = useState(false);
  const titleBoxRef = useRef();
  const titleTextRef = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    const boxHeight = titleBoxRef.current?.offsetHeight;
    const titleElement = titleBoxRef.current?.querySelector('span');
    const titleHeight = titleElement?.offsetHeight;
    if (titleHeight > boxHeight) {
      setShowTitleTooltip(true);
    }
  }, []);

  const checkUnread = () => {
    if (user?.id && issue.events) {
      return user?.id !== issue.events[issue.events?.length - 1]?.user &&
        issue.events?.length &&
        issue.events?.length >= issue.read
        ? unreadChanges
        : {};
    }
  };

  const url = () => {
    if (isPublic) {
      return `/public-issues/audit-issue/${auditId}/${issue.id}`;
    } else if (saved) {
      return `/private-issues/audit-issue/${auditId}/${issue.id}`;
    } else {
      return `/issues/audit-issue/${auditId}/${issue.id}`;
    }
  };

  const handleButtonClick = event => {
    event.stopPropagation();
    event.preventDefault();
    if (isPublic) {
      const array = JSON.parse(localStorage.getItem('publicIssues'));
      const newArray = array.filter(item => item.id !== issue.id);
      localStorage.setItem('publicIssues', JSON.stringify(newArray));
      dispatch(deletePublicIssue(issue.id));
    } else {
      console.log(issue);
      dispatch(deleteIssue(issue, auditId));
    }
    // Здесь вы можете добавить свою логику для обработки клика на кнопку
  };

  return (
    <Link
      sx={issueRow}
      component={RouterLink}
      onClick={() => window.scrollTo({ top: 0 })}
      to={url()}
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
        <Typography
          sx={[columnText, issueTitleSx, checkUnread()]}
          ref={titleBoxRef}
        >
          <span ref={titleTextRef}>{issue.name}</span>
        </Typography>
      </Tooltip>
      <Typography sx={[columnText, statusSx(issue.status)]}>
        {addSpacesToCamelCase(issue.status)}
      </Typography>
      <Box sx={isPublic || saved ? publicSeverityWrapper : severityWrapper}>
        <IssueSeverity
          sx={isPublic || saved ? publicSeverity : {}}
          text={issue.severity}
        />
        {(isPublic || saved) && (
          <Button color={'error'} onClick={handleButtonClick} sx={actionSx}>
            <DeleteIcon />
          </Button>
        )}
      </Box>
    </Link>
  );
};

export default IssueListItem;

const actionSx = theme => ({
  minWidth: 'unset',
  padding: '7px',
  width: '30px',
  marginLeft: '5px',
  marginRight: '20px',
  [theme.breakpoints.down('sm')]: {
    marginRight: '5px',
  },
});

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
  [theme.breakpoints.down('sm')]: {
    padding: '15px 10px 15px 0',
  },
  [theme.breakpoints.down('xs')]: {
    justifyContent: 'space-between',
  },
});

const publicSeverity = theme => ({
  [theme.breakpoints.down('xs')]: {
    width: '60%',
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
  if (status === DRAFT) color = '#52176D';
  if (status === VERIFICATION || status === IN_PROGRESS) color = '#5b97bb';
  if (status === FIXED || status === NOT_FIXED) color = '#09C010';

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

const publicSeverityWrapper = theme => ({
  width: '15%',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  [theme.breakpoints.down('xs')]: {
    width: '20%',
  },
  [theme.breakpoints.down(550)]: {
    width: '30%',
  },
});

const unreadChanges = theme => ({
  position: 'relative',
  '&::before': {
    display: 'block',
    content: "''",
    position: 'absolute',
    top: '50%',
    left: '10px',
    transform: 'translateY(-50%)',
    width: '8px',
    height: '8px',
    backgroundColor: 'red',
    borderRadius: '50%',
    [theme.breakpoints.down('xs')]: {
      left: '5px',
      width: '5px',
      height: '5px',
    },
  },
});
