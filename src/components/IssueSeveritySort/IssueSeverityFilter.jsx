import React from 'react';
import { Box, Tooltip, Typography } from '@mui/material';
import { issuesCounter } from '../../lib/helper.js';

const IssueSeveritySort = ({ issues }) => {
  const issueSort = issues.reduce((acc, issue) => {
    acc.critical = acc.critical || 0;
    acc.major = acc.major || 0;
    acc.medium = acc.medium || 0;
    acc.minor = acc.minor || 0;

    if (issue.severity.toLowerCase() === 'critical') acc.critical += 1;
    if (issue.severity.toLowerCase() === 'major') acc.major += 1;
    if (issue.severity.toLowerCase() === 'medium') acc.medium += 1;
    if (issue.severity.toLowerCase() === 'minor') acc.minor += 1;

    return acc;
  }, {});

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
      }}
    >
      <Tooltip arrow placement={'top'} title={'Critical'}>
        <Box sx={[blockSx]}>
          <Box sx={[severityBox, { backgroundColor: '#FF0000' }]} />
          <Typography>{issueSort.critical}</Typography>
        </Box>
      </Tooltip>
      <Tooltip arrow placement={'top'} title={'Major'}>
        <Box sx={[blockSx]}>
          <Box sx={[severityBox, { backgroundColor: '#FF9900' }]} />
          <Typography>{issueSort.major}</Typography>
        </Box>
      </Tooltip>
      <Tooltip arrow placement={'top'} title={'Medium'}>
        <Box sx={blockSx}>
          <Box sx={[severityBox, { backgroundColor: '#5b97bb' }]} />
          <Typography>{issueSort.medium}</Typography>
        </Box>
      </Tooltip>
      <Tooltip arrow placement={'top'} title={'Minor'}>
        <Box sx={blockSx}>
          <Box sx={[severityBox, { backgroundColor: '#09C010' }]} />
          <Typography>{issueSort.minor}</Typography>
        </Box>
      </Tooltip>
    </Box>
  );
};

export default IssueSeveritySort;

const severityBox = theme => ({
  height: '18px',
  width: '18px',
  borderRadius: '50%',
});

const blockSx = theme => ({
  mb: '12px',
  fontSize: '14px!important',
  width: '50%',
  display: 'flex',
  justifyContent: 'center',
  gap: '10px',
  alignItems: 'center',
});
