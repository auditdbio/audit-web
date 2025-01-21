import React, { useEffect, useState, useRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { addSpacesToCamelCase, addTestsLabel } from '../../lib/helper.js';
import { Box, Link, Tooltip, Typography, Zoom } from '@mui/material';
import IssueSeverity from './IssueSeverity.jsx';
import theme from '../../styles/themes.js';
import {
  DRAFT,
  FIXED,
  IN_PROGRESS,
  NOT_FIXED,
  VERIFICATION,
  WILL_NOT_FIX,
} from './constants.js';
import CustomLink from '../custom/CustomLink.jsx';

const IssueListItem = ({
  issue,
  auditId,
  user,
  isPublic,
  saved,
  hideControl,
  code,
}) => {
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

  const checkUnread = () => {
    if (user?.id && issue.events) {
      return user?.id !== issue.events[issue.events?.length - 1]?.user &&
        issue.events?.length &&
        issue.events?.length >= issue.read
        ? unreadChanges
        : {};
    }
  };

  return (
    <Link
      sx={[
        issueRow(
          theme,
          titleBoxRef.current?.offsetHeight,
          !!issue.links.length,
        ),
        checkUnread(),
      ]}
      component={RouterLink}
      onClick={() => window.scrollTo({ top: 0 })}
      to={
        hideControl
          ? code
            ? `/p-issues/audit-issue/${auditId}/${issue.id}?code=${code}`
            : `/p-issues/audit-issue/${auditId}/${issue.id}`
          : isPublic && !saved
          ? `/public-issues/audit-issue/${auditId}/${issue.id}`
          : saved
          ? `/private-issues/audit-issue/${auditId}/${issue.id}`
          : `/issues/audit-issue/${auditId}/${issue.id}`
      }
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
        <Box sx={wrapper}>
          <Typography sx={[columnText, issueTitleSx]} ref={titleBoxRef}>
            <span ref={titleTextRef}>{issue.name}</span>
          </Typography>
          {!!issue.links.length && (
            <Box sx={issueLinksSx}>
              <CustomLink
                sx={linkPropSx}
                link={issue.links[0]}
                shortLength={12}
              />
            </Box>
          )}
        </Box>
      </Tooltip>

      <Box sx={issueInfoSx}>
        <Typography sx={[columnText, statusSx(issue.status)]}>
          {addSpacesToCamelCase(issue.status)}
        </Typography>
        <Box sx={severityWrapper}>
          <IssueSeverity text={issue.severity} />
        </Box>
      </Box>
    </Link>
  );
};

export default IssueListItem;

const issueRow = (theme, titleHeight, isContainsLinks = false) => {
  return {
    display: 'flex',
    width: '100%',
    paddingY:
      titleHeight <= 25
        ? isContainsLinks
          ? '13px'
          : '25px'
        : isContainsLinks
        ? '10px'
        : '16px',
    gap: '5px',
    textDecoration: 'none',
    cursor: 'pointer',
    border: '2px solid #E5E5E5',
    borderBottom: 'none',
    '&:last-child': { borderBottom: '2px solid #E5E5E5' },
    ':hover': { backgroundColor: '#F1F1F1' },
    [theme.breakpoints.down('sm')]: {
      paddingY: titleHeight <= 25 ? (isContainsLinks ? '6px' : '16px') : '7px',
    },
    [theme.breakpoints.down('xs')]: {
      justifyContent: 'space-between',
    },
  };
};

const columnText = theme => ({
  color: '#434242',
  fontSize: '20px',
  fontWeight: 500,
  lineHeight: '25px',
  [theme.breakpoints.down('lg')]: {
    fontSize: '18px',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '16px',
  },
  [theme.breakpoints.down('xs')]: {
    fontSize: '12px',
  },
});

const wrapper = theme => ({
  alignSelf: 'center',
  padding: '0 25px 0 30px',
  width: '75%',
  [theme.breakpoints.down(915)]: {
    width: '70%',
  },
  [theme.breakpoints.down(600)]: {
    width: '100%',
  },
  [theme.breakpoints.down('xs')]: {
    padding: '0 15px 0 20px',
  },
});

const issueInfoSx = theme => ({
  display: 'flex',
  width: '25%',
  justifyContent: 'flex-end',
  pr: '30px',
  [theme.breakpoints.down(915)]: {
    width: '30%',
  },
  [theme.breakpoints.down('xs')]: {
    pr: '20px',
  },
});

const issueTitleSx = {
  display: '-webkit-box',
  maxHeight: '50px',
  overflow: 'hidden',
  wordBreak: 'break-word',
  alignSelf: 'center',
  '-webkit-line-clamp': '2',
  '-webkit-box-orient': 'vertical',
  'text-overflow': 'ellipsis',
};

const issueLinksSx = theme => ({
  mt: '7px',
  [theme.breakpoints.down('sm')]: {
    mt: '3px',
  },
  '& p': {
    display: 'flex',
    alignItems: 'center',
    mb: 0,
  },
  '& svg': {
    width: '16px',
    [theme.breakpoints.down('xs')]: {
      mr: '5px',
    },
  },
});

const linkPropSx = theme => ({
  width: 'unset',
  [theme.breakpoints.down('xs')]: {
    '& span': {
      fontSize: '12px !important',
    },
  },
});

const statusSx = status => {
  let color = '#434242';
  if (status === DRAFT) color = '#52176D';
  if (status === VERIFICATION || status === IN_PROGRESS) color = '#5b97bb';
  if (status === FIXED || status === NOT_FIXED || status === WILL_NOT_FIX)
    color = '#09C010';

  return {
    display: 'flex',
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    padding: '0 !important',
    mr: '20px',
    letterSpacing: '-1px',
    color,
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  };
};

const severityWrapper = theme => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  '& span': { width: '80px', textAlign: 'center' },
  [theme.breakpoints.down(600)]: {
    '& span': {
      width: '32px',
      '& span': {
        display: 'none',
      },
    },
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
      left: '6px',
      width: '6px',
      height: '6px',
    },
  },
});
