import React, { useEffect, useState } from 'react';
import Layout from '../styles/Layout.jsx';
import { Box, Button, useMediaQuery } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack.js';
import Filter from '../components/forms/filter/index.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom/dist';
import AuditorListCard from '../components/AuditorListCard.jsx';
import { searchAuditor } from '../redux/actions/auditorAction.js';
import theme from '../styles/themes.js';
import CustomPagination from '../components/custom/CustomPagination.jsx';
import { addTestsLabel } from '../lib/helper.js';
import Headings from '../router/Headings.jsx';

const AuditorsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const matchSm = useMediaQuery(theme.breakpoints.down('sm'));
  const matchXs = useMediaQuery(theme.breakpoints.down('xs'));
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(undefined);
  const auditors = useSelector(s => s.auditor.auditors);
  const totalAuditors = useSelector(s => s.auditor.searchTotalAuditors);
  const [projectIdToInvite, setProjectIdToInvite] = useState(() =>
    searchParams.get('projectIdToInvite'),
  );
  const [currentPage, setCurrentPage] = useState(
    +searchParams.get('page') || 1,
  );

  const applyFilter = filter => {
    setQuery(query => {
      const { ...data } = query || {};
      setCurrentPage(1);
      return {
        ...data,
        page: 1,
        sort: filter.sort || '',
        sort_by: filter.sort_by || '',
        search: filter.search || '',
        tags: filter.tags || [],
        dateFrom: filter.dateFrom || '',
        dateTo: filter.dateTo || '',
        from: filter.price.from || '',
        to: filter.price.to || '',
        readyToWait: filter.readyToWait || '',
      };
    });
    dispatch(searchAuditor(filter));
  };

  const initialFilter = {
    page: searchParams.get('page') || 1,
    search: searchParams.get('search') || '',
    tags: searchParams.getAll('tags') || [],
    dateFrom: searchParams.get('dateFrom') || new Date(),
    dateTo: searchParams.get('dateTo') || new Date(),
    sort: searchParams.get('sort') || '1',
    sort_by: searchParams.get('sort_by') || 'rating',
    readyToWait: searchParams.get('readyToWait') || '',
    price: {
      from: searchParams.get('from') || 0,
      to: searchParams.get('to') || 0,
    },
  };

  const clearFilter = () => {
    setQuery(query => {
      const { ...data } = query || {};
      return {};
    });
  };

  const getNumberOfPages = () => {
    return Math.ceil(totalAuditors / 10);
  };

  const handleChangePage = (e, page) => {
    setCurrentPage(page);
    setQuery(prev => {
      const { ...data } = prev || initialFilter;
      return { ...data, page };
    });
  };

  useEffect(() => {
    if (query) {
      setSearchParams({ ...query });
    }
  }, [query]);

  useEffect(() => {
    dispatch(searchAuditor(initialFilter));
  }, [searchParams.toString()]);

  useEffect(() => {
    setCurrentPage(+searchParams.get('page') || 1);
  }, [searchParams.toString()]);

  return (
    <Layout>
      <Headings title="Auditors" />

      <Box sx={wrapper}>
        <Box sx={headWrapper}>
          <Button
            onClick={() => navigate('/')}
            aria-label="Go back"
            {...addTestsLabel('go-back-button')}
          >
            <ArrowBackIcon color="secondary" />
          </Button>
          <Box>
            <Filter
              target="auditor"
              submit={applyFilter}
              initial={initialFilter}
            />
          </Box>
        </Box>
        <CustomPagination
          show={auditors?.length > 0}
          count={getNumberOfPages()}
          sx={{ mb: '20px' }}
          page={currentPage}
          onChange={handleChangePage}
          showFirstLast={!matchXs}
          size="small"
        />
        {auditors?.length > 0 && (
          <Box sx={contentWrapper}>
            {auditors?.map((auditor, idx) => (
              <Box sx={auditorContainerStyle(idx)} key={auditor.user_id}>
                <AuditorListCard
                  budge={auditor.kind === 'badge'}
                  auditor={auditor}
                  projectIdToInvite={projectIdToInvite}
                />
              </Box>
            ))}
            {!matchSm && auditors?.length % 2 === 1 && (
              <Box sx={fakeContainerStyle} />
            )}
          </Box>
        )}
        {auditors?.length === 0 && <Box sx={noResults}>No results</Box>}
        <CustomPagination
          show={auditors?.length > 0}
          count={getNumberOfPages()}
          sx={{ display: 'flex', justifyContent: 'flex-end' }}
          page={currentPage}
          onChange={handleChangePage}
          showFirstLast={!matchXs}
          size="small"
        />
      </Box>
    </Layout>
  );
};

export default AuditorsPage;

const wrapper = theme => ({
  width: '100%',
  padding: '20px',
  backgroundColor: '#FCFAF6',
  border: '1.42857px solid #D9D9D9',
  boxShadow:
    '0px 71.4286px 57.1429px rgba(0, 0, 0, 0.07),' +
    ' 0px 29.8412px 23.8729px rgba(0, 0, 0, 0.0503198), ' +
    '0px 15.9545px 12.7636px rgba(0, 0, 0, 0.0417275), ' +
    '0px 8.94397px 7.15517px rgba(0, 0, 0, 0.035), ' +
    '0px 4.75007px 3.80006px rgba(0, 0, 0, 0.0282725), ' +
    '0px 1.97661px 1.58129px rgba(0, 0, 0, 0.0196802)',
  borderRadius: '10.7143px',
  minHeight: '1000px',
});

const headWrapper = theme => ({
  display: 'flex',
  justifyContent: 'space-between',
  mb: '20px',
  [theme.breakpoints.down('sm')]: {
    mb: '10px',
  },
});

const contentWrapper = {
  display: 'flex',
  flexWrap: 'wrap',
  mb: '20px',
  borderLeft: '1px solid #B2B3B3',
};

const auditorContainerStyle = idx => ({
  maxHeight: '200px',
  minHeight: '150px',
  borderRight: '1px solid #B2B3B3',
  borderBottom: '1px solid #B2B3B3',
  borderTop: idx <= 1 ? '1px solid #B2B3B3' : 'none',
  width: {
    zero: '100%',
    sm: '50%',
    md: '50%',
    lg: '50%',
  },
  [theme.breakpoints.down('sm')]: {
    borderTop: idx === 0 ? '1px solid #B2B3B3' : 'none',
  },
  [theme.breakpoints.down('xs')]: {
    height: '130px',
  },
});

const fakeContainerStyle = {
  width: {
    zero: '100%',
    sm: '50%',
    md: '50%',
    lg: '50%',
  },
  border: '0.5px solid #B2B3B3',
};

const noResults = {
  paddingTop: '70px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};
