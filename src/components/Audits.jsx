import React from 'react';
import { Box, Grid } from '@mui/material';
import AuditCard from './Audit-card.jsx';
import { useSelector } from 'react-redux';

const Audits = () => {
  const auditRequests = useSelector(s => s.audits.auditRequests);
  const audits = useSelector(s => s.audits.audits);

  return (
    <Box sx={wrapper}>
      <Grid container spacing={2}>
        {audits?.map(audit => (
          <Grid key={audit.id} item xs={6} md={3} sm={4} sx={gridItemStyle}>
            <AuditCard audit={audit} />
          </Grid>
        ))}
        {auditRequests?.map(audit => (
          <Grid key={audit.id} item xs={6} md={3} sm={4} sx={gridItemStyle}>
            <AuditCard audit={audit} request={true} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Audits;

const wrapper = theme => ({
  padding: '50px 40px 40px',
  width: '100%',
  [theme.breakpoints.down('sm')]: {
    padding: '22px',
  },
  [theme.breakpoints.down('xs')]: {
    padding: '12px',
  },
});

export const gridItemStyle = theme => ({
  [theme.breakpoints.down('xs')]: {
    width: '50%',
  },
});
