import React, { useEffect, useState } from 'react';
import { Box, Button, Grid, useMediaQuery } from '@mui/material';
import AuditRequestCard from './Audit-request-card';
import { useDispatch, useSelector } from 'react-redux';
import { addTestsLabel, calcTotalPages } from '../lib/helper.js';
import { CUSTOMER } from '../redux/actions/types.js';
import { useNavigate } from 'react-router-dom/dist';
import { getAuditsRequest } from '../redux/actions/auditAction.js';
import CustomPagination from './custom/CustomPagination.jsx';
import { useSearchParams } from 'react-router-dom';
import theme from '../styles/themes.js';

const AuditRequest = () => {
  const auditRequests = useSelector(s => s.audits.auditRequests);
  const { totalAuditRequests } = useSelector(s => s.audits);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentRole = useSelector(s => s.user.user.current_role);
  const dispatch = useDispatch();
  const [query, setQuery] = useState(undefined);
  const matchXs = useMediaQuery(theme.breakpoints.down('xs'));
  const [currentRequestPage, setCurrentRequestPage] = useState(
    +searchParams.get('page') || 1,
  );

  const handleNavigate = () => {
    navigate('/projects');
  };

  useEffect(() => {
    dispatch(getAuditsRequest(currentRole, +searchParams.get('page')));
  }, [searchParams.get('page')]);

  useEffect(() => {
    if (query) {
      setSearchParams({ ...query });
    }
  }, [query]);

  const handleChangeRequestPage = (e, page) => {
    setCurrentRequestPage(page);
    setQuery(prev => {
      const { ...data } = prev || {};
      return { ...data, page };
    });
  };

  const totalAuditRequestPages = calcTotalPages(totalAuditRequests || 0);

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
      <CustomPagination
        show={totalAuditRequests > 12}
        count={totalAuditRequestPages}
        sx={{ mt: '30px', display: 'flex', justifyContent: 'flex-end' }}
        page={currentRequestPage}
        onChange={handleChangeRequestPage}
        showFirstLast={!matchXs}
        size={matchXs ? 'small' : 'medium'}
        color={'secondary'}
      />
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
