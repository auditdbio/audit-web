import React, { useEffect, useState } from 'react';
import { Box, Grid, Tab, Tabs, useMediaQuery } from '@mui/material';
import AuditCard from './Audit-card.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { getAudits, getAuditsRequest } from '../redux/actions/auditAction.js';
import { AUDITOR, CUSTOMER } from '../redux/actions/types.js';
import { getProjects } from '../redux/actions/projectAction.js';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import theme from '../styles/themes.js';
import { addTestsLabel, calcTotalPages } from '../lib/helper.js';
import CustomPagination from './custom/CustomPagination.jsx';
import CustomTabs from './custom/CustomTabs.jsx';

const Audits = () => {
  const { auditRequests, totalAudits } = useSelector(s => s.audits);
  const { audits, totalAuditRequests } = useSelector(s => s.audits);
  const currentRole = useSelector(s => s.user.user.current_role);
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(undefined);
  const matchXs = useMediaQuery(theme.breakpoints.down('xs'));

  const [currentAuditPage, setCurrentAuditPage] = useState(
    +searchParams.get('pageAudit') || 1,
  );

  const [currentRequestPage, setCurrentRequestPage] = useState(
    +searchParams.get('pageRequest') || 1,
  );
  const [chooseTab, setChooseTab] = useState(
    searchParams.get('type') || 'audits',
  );

  useEffect(() => {
    dispatch(getAudits(currentRole, searchParams.get('pageAudit')));
  }, [searchParams.get('pageAudit')]);

  useEffect(() => {
    dispatch(getAuditsRequest(currentRole, searchParams.get('pageRequest')));
  }, [searchParams.get('pageRequest')]);

  useEffect(() => {
    if (query) {
      setSearchParams({ ...query });
    }
  }, [query, chooseTab]);

  const handleChangeAuditPage = (e, page) => {
    setCurrentAuditPage(page);
    setQuery(prev => {
      const { ...data } = prev || {};
      return { ...data, pageAudit: page };
    });
  };

  const handleChangeRequestPage = (e, page) => {
    setCurrentRequestPage(page);
    setQuery(prev => {
      const { ...data } = prev || {};
      return { ...data, pageRequest: page };
    });
  };

  useEffect(() => {
    setCurrentAuditPage(+searchParams.get('pageAudit') || 1);
    setCurrentRequestPage(+searchParams.get('pageRequest') || 1);
    setChooseTab(searchParams.get('type') || 'audits');
  }, [
    searchParams.get('pageAudit'),
    searchParams.get('pageRequest'),
    searchParams.get('type'),
  ]);

  const totalAuditPages = calcTotalPages(totalAudits || 0);
  const totalAuditRequestPages = calcTotalPages(totalAuditRequests || 0);

  const handleChange = value => {
    setQuery(prev => {
      const { ...data } = prev || {};
      return { ...data, type: value };
    });
  };

  return (
    <Box sx={wrapper}>
      <CustomTabs
        selectedTabSx={customerTabSx}
        name={'type'}
        choosenTab={chooseTab}
        tabs={tabs}
        setTab={setChooseTab}
        tabsStyle={tabsStyle}
        custom={true}
        onChange={handleChange}
      />
      <Grid container spacing={2}>
        {chooseTab === 'audits'
          ? audits?.map(audit => (
              <Grid key={audit.id} item xs={6} md={3} sm={4} sx={gridItemStyle}>
                <AuditCard audit={audit} />
              </Grid>
            ))
          : auditRequests?.map(audit => (
              <Grid key={audit.id} item xs={6} md={3} sm={4} sx={gridItemStyle}>
                <AuditCard audit={audit} request={true} />
              </Grid>
            ))}
      </Grid>
      {chooseTab === 'audits' ? (
        <CustomPagination
          show={totalAudits > 12}
          count={totalAuditPages}
          sx={{ mt: '30px', display: 'flex', justifyContent: 'flex-end' }}
          page={currentAuditPage}
          onChange={handleChangeAuditPage}
          showFirstLast={!matchXs}
          size={matchXs ? 'small' : 'medium'}
          color={'primary'}
        />
      ) : (
        <CustomPagination
          show={totalAuditRequests > 12}
          count={totalAuditRequestPages}
          sx={{ mt: '30px', display: 'flex', justifyContent: 'flex-end' }}
          page={currentRequestPage}
          onChange={handleChangeRequestPage}
          showFirstLast={!matchXs}
          size={matchXs ? 'small' : 'medium'}
          color={'primary'}
        />
      )}
    </Box>
  );
};

export default Audits;

const tabs = [
  {
    label: 'Audits',
    value: 'audits',
  },
  {
    label: 'Audit requests',
    value: 'auditRequests',
  },
];

const tabsStyle = theme => ({
  marginBottom: '25px',
  width: '400px',
  marginX: 'auto',
  borderRadius: '10px',
  [theme.breakpoints.down('xs')]: {
    minHeight: '35px',
    height: '35px',
    width: '100%',
    '& .MuiTabs-flexContainer': {
      gap: 0,
      // display: 'block'
    },
  },
});

const customerTabSx = theme => ({
  backgroundColor: theme.palette.primary.main,
  color: '#FCFAF6!important',
});

const wrapper = theme => ({
  padding: '30px 53px',
  width: '100%',
  alignSelf: 'flex-start',
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
