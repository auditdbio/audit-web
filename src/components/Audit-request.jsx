import React from 'react';
import { Box, Button, Grid } from '@mui/material';
import AuditRequestCard from './Audit-request-card';
import { useSelector } from 'react-redux';
import { addTestsLabel } from '../lib/helper.js';
import { CUSTOMER } from '../redux/actions/types.js';
import { useNavigate } from 'react-router-dom/dist';

const AuditRequest = () => {
  const auditRequests = useSelector(s => s.audits.auditRequests);
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/projects');
  };

  return (
    <Box sx={wrapper}>
      <Box sx={buttonWrapper}>
        <Button
          sx={buttonSx}
          variant={'contained'}
          color={'secondary'}
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
      </Grid>
    </Box>
  );
};

export default AuditRequest;

const wrapper = theme => ({
  padding: '58px 52px 42px',
  minHeight: '560px',
  width: '100%',
  [theme.breakpoints.down('md')]: {
    padding: '36px 25px 45px',
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
  mb: '46px',
  [theme.breakpoints.down('sm')]: {
    mb: '28px',
  },
});

const buttonSx = theme => ({
  padding: '9px 35px',
  borderRadius: '10px',
  fontSize: '18px',
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
    fontSize: '12px',
  },
});
