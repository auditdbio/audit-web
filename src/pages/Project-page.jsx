import React, { useEffect, useState } from 'react';
import Layout from '../styles/Layout.jsx';
import { Box, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack.js';
import Filter from '../components/forms/filter/index.jsx';
import ProjectListCard from '../components/Project-list-card.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom/dist';
import { PROJECTS } from '../redux/actions/types.js';
import { searchProjects } from '../redux/actions/projectAction.js';
import { clearMessage } from '../redux/actions/auditAction.js';
import CustomPagination from '../components/custom/CustomPagination.jsx';

const ProjectPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const projects = useSelector(s => s.project.searchProjects);
  const totalProjects = useSelector(s => s.project.searchTotalProjects);
  const [currentPage, setCurrentPage] = useState(
    +searchParams.get('page') || 1,
  );
  const [query, setQuery] = useState(undefined);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const applyFilter = filter => {
    setQuery(query => {
      const { ...data } = query || {};
      setCurrentPage(1);
      return {
        ...data,
        page: 1,
        sort: filter.sort || '',
        search: filter.search || '',
        tags: filter.tags || [],
        dateFrom: filter.dateFrom || '',
        dateTo: filter.dateTo || '',
        from: filter.price.from || '',
        to: filter.price.to || '',
        readyToWait: filter.readyToWait || '',
      };
    });
    dispatch(searchProjects(filter));
  };

  const clearFilter = () => {
    setQuery(query => {
      const { ...data } = query || {};
      return {};
    });
  };

  const initialFilter = {
    page: searchParams.get('page') || 1,
    search: searchParams.get('search') || '',
    tags: searchParams.getAll('tags') || [],
    dateFrom: searchParams.get('dateFrom') || new Date(),
    dateTo: searchParams.get('dateTo') || new Date(),
    sort: searchParams.get('sort') || '',
    readyToWait: searchParams.get('readyToWait') || '',
    price: {
      from: searchParams.get('from') || 0,
      to: searchParams.get('to') || 0,
    },
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const getNumberOfPages = () => {
    return Math.ceil(totalProjects / 10);
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
    dispatch(searchProjects(initialFilter));
  }, [searchParams.toString()]);

  useEffect(() => {
    setCurrentPage(+searchParams.get('page') || 1);
  }, [searchParams.toString()]);

  useEffect(() => {
    return () => dispatch(clearMessage());
  }, []);

  return (
    <Layout>
      <Box sx={wrapper}>
        <Box sx={projectTopWrapper}>
          <Button onClick={handleGoBack} aria-label="Go back">
            <ArrowBackIcon color={'secondary'} />
          </Button>
          <Box>
            <Filter
              target={PROJECTS}
              initial={initialFilter}
              submit={applyFilter}
            />
          </Box>
        </Box>
        <CustomPagination
          show={projects?.length > 0}
          count={getNumberOfPages()}
          sx={{ mb: '20px' }}
          page={currentPage}
          onChange={handleChangePage}
        />
        <Box sx={contentWrapper}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
            {projects?.map((project, idx) => (
              <Box
                sx={[
                  projectListWrapper,
                  idx % 2 === 0 ? borderLeft : {},
                  idx === 0 || idx === 1 ? borderTop : {},
                  idx === 0 ? mobileStyle : {},
                ]}
                key={project.id}
              >
                <ProjectListCard project={project} />
              </Box>
            ))}
          </Box>
        </Box>
        {projects?.length === 0 && <Box sx={noResults}>No results</Box>}
        <CustomPagination
          show={projects?.length > 0}
          count={getNumberOfPages()}
          sx={{ display: 'flex', justifyContent: 'flex-end' }}
          page={currentPage}
          onChange={handleChangePage}
        />
      </Box>
    </Layout>
  );
};

export default ProjectPage;

const contentWrapper = theme => ({
  mb: '20px',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    flexWrap: 'unset',
  },
});

const mobileStyle = theme => ({
  [theme.breakpoints.down('sm')]: {
    borderTop: '1px solid #B2B3B3',
  },
});

const borderTop = theme => ({
  borderTop: '1px solid #B2B3B3',
  [theme.breakpoints.down('sm')]: {
    borderTop: 'unset',
  },
});

const borderLeft = theme => ({
  borderLeft: '1px solid #B2B3B3',
});

const projectTopWrapper = theme => ({
  display: 'flex',
  justifyContent: 'space-between',
  mb: '20px',
  alignItems: 'center',
  [theme.breakpoints.down('xs')]: {
    '& button': {
      marginLeft: 0,
      minWidth: '40px',
    },
  },
});

const projectListWrapper = theme => ({
  borderRight: '1px solid #B2B3B3',
  borderBottom: '1px solid #B2B3B3',
  height: '200px',
  overflow: 'hidden',
  width: '50%',
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    borderLeft: '1px solid #B2B3B3',
    height: '160px',
  },
});

const wrapper = theme => ({
  width: '100%',
  padding: '43px 20px 44px 20px',
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
  [theme.breakpoints.down('sm')]: {
    paddingLeft: '20px',
    paddingTop: '22px',
  },
});

const noResults = {
  paddingTop: '70px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};
