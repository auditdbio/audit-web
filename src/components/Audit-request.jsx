import React from 'react';
import { Box, Button, Grid } from '@mui/material';
import AuditRequestCard from './Audit-request-card';
import { useSelector } from 'react-redux';
import { addTestsLabel } from '../lib/helper.js';
import { useNavigate } from 'react-router-dom/dist';
import Headings from '../router/Headings.jsx';

const AuditRequest = () => {
  const auditRequests = useSelector(s => s.audits.auditRequests);
  const organizationAuditRequests = useSelector(
    s => s.audits.organizationAuditRequests,
  );
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/projects');
  };

  return (
    <Box sx={wrapper}>
      <Headings title="My Audit Requests" />

      <Box sx={buttonWrapper}>
        <Button
          sx={buttonSx}
          variant="contained"
          color="secondary"
          onClick={handleNavigate}
          {...addTestsLabel('add-new-button')}
        >
          + New audit
        </Button>
      </Box>
      <Grid container spacing={2}>
        {auditRequests?.map(request => (
          <Grid item sx={gridItemStyle} key={request.id}>
            <AuditRequestCard request={request} />
          </Grid>
        ))}
        {organizationAuditRequests?.map(request => (
          <Grid item sx={gridItemStyle} key={request.id}>
            <AuditRequestCard request={request} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AuditRequest;

const wrapper = theme => ({
  padding: '20px 40px 40px',
  minHeight: '560px',
  width: '100%',
  [theme.breakpoints.down('md')]: {
    padding: '20px 25px 40px',
  },
  [theme.breakpoints.down('xxs')]: {
    padding: '20px 10px 40px',
  },
});

const gridItemStyle = theme => ({
  width: '25%',
  [theme.breakpoints.down('sm')]: {
    width: '33.330%',
  },
  [theme.breakpoints.down('xs')]: {
    width: '100%',
  },
});

const buttonWrapper = theme => ({
  display: 'flex',
  justifyContent: 'center',
  mb: '30px',
  [theme.breakpoints.down('sm')]: {
    mb: '20px',
  },
});

const buttonSx = theme => ({
  padding: '9px 35px',
  borderRadius: '10px',
  fontSize: '16px',
  fontWeight: 600,
  lineHeight: '30px',
  textTransform: 'none',
  [theme.breakpoints.down('sm')]: {
    fontSize: '14px',
    width: '161px',
    padding: '11px 25px',
    height: '40px',
  },
  [theme.breakpoints.down('xs')]: {
    width: '130px',
    fontSize: '12px',
  },
});
