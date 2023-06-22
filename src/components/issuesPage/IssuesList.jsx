import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import Control from './Control.jsx';
import CustomPagination from '../custom/CustomPagination.jsx';
import ArrowIcon from '../icons/ArrowIcon.jsx';
import {
  SEVERITY_ASCENDING,
  SEVERITY_DESCENDING,
  STATUS_ASCENDING,
  STATUS_DESCENDING,
  severityOrder,
  statusOrder,
} from './constants.js';
import ArrowUpIcon from '../icons/ArrowUpIcon.jsx';
import IssueListItem from './IssueListItem.jsx';
import { clearMessage } from '../../redux/actions/auditAction.js';
import CustomSnackbar from '../custom/CustomSnackbar.jsx';

const IssuesList = ({ auditId }) => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { issues } = useSelector(s => s.issues);
  const { successMessage, error } = useSelector(s => s.audits);

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [page, setPage] = useState(+searchParams.get('page') || 1);
  const [sortType, setSortType] = useState(
    searchParams.get('sort') || STATUS_DESCENDING,
  );

  const getNumberOfPages = () => Math.ceil(getSearchResultsLength() / 10);

  const getSearchResultsLength = () => {
    return issues?.filter(issue => issue.name?.includes(search)).length;
  };

  const handlePageChange = (e, page) => {
    setPage(page);
    setSearchParams(prev => ({ ...Object.fromEntries(prev.entries()), page }));
  };

  const sortFunc = (a, b) => {
    switch (sortType) {
      case STATUS_DESCENDING:
        return statusOrder[a.status] - statusOrder[b.status] || 0;
      case STATUS_ASCENDING:
        return statusOrder[b.status] - statusOrder[a.status] || 0;
      case SEVERITY_DESCENDING:
        return severityOrder[a.severity] - severityOrder[b.severity] || 0;
      case SEVERITY_ASCENDING:
        return severityOrder[b.severity] - severityOrder[a.severity] || 0;
      default:
        return statusOrder[a.status] - statusOrder[b.status] || 0;
    }
  };

  const handleSeveritySort = () => {
    setPage(1);
    if (sortType === SEVERITY_DESCENDING) {
      setSortType(SEVERITY_ASCENDING);
    } else {
      setSortType(SEVERITY_DESCENDING);
    }
  };

  const handleStatusSort = () => {
    setPage(1);
    if (sortType === STATUS_DESCENDING) {
      setSortType(STATUS_ASCENDING);
    } else {
      setSortType(STATUS_DESCENDING);
    }
  };

  useEffect(() => {
    setSearchParams(prev => ({
      ...Object.fromEntries(prev.entries()),
      page,
      sort: sortType,
    }));
  }, [sortType]);

  return (
    <>
      <CustomSnackbar
        autoHideDuration={5000}
        open={!!error || !!successMessage}
        severity={error ? 'error' : 'success'}
        text={error || successMessage}
        onClose={() => dispatch(clearMessage())}
      />

      <Control
        issues={issues}
        search={search}
        setSearch={setSearch}
        setPage={setPage}
        setSearchParams={setSearchParams}
      />

      <Box sx={{ display: 'flex', width: '100%', justifyContent: 'flex-end' }}>
        <Box sx={columnsTitleBlock}>
          <Button
            sx={[columnText, columnTitle, columnTitleHidden]}
            onClick={handleStatusSort}
          >
            <span>Status</span>
            <span>
              {sortType === STATUS_ASCENDING ? <ArrowUpIcon /> : <ArrowIcon />}
            </span>
          </Button>
          <Button sx={[columnText, columnTitle]} onClick={handleSeveritySort}>
            <span>Severity</span>
            <span>
              {sortType === SEVERITY_ASCENDING ? (
                <ArrowUpIcon />
              ) : (
                <ArrowIcon />
              )}
            </span>
          </Button>
        </Box>
      </Box>

      <Box sx={{ width: '100%' }}>
        {issues
          ?.filter(issue => issue.name?.includes(search))
          .sort(sortFunc)
          .slice((page - 1) * 10, page * 10)
          .map(issue => (
            <IssueListItem issue={issue} key={issue.id} auditId={auditId} />
          ))}
      </Box>

      {getSearchResultsLength() === 0 && <Box sx={noResults}>Empty</Box>}

      <CustomPagination
        show={getSearchResultsLength() > 10}
        count={getNumberOfPages()}
        onChange={handlePageChange}
        page={page}
        showFirstLast={false}
      />
    </>
  );
};

export default IssuesList;

const columnsTitleBlock = theme => ({
  display: 'flex',
  width: '30%',
  [theme.breakpoints.down('xs')]: {
    pr: '15px',
    justifyContent: 'flex-end',
  },
});

const columnTitle = theme => ({
  width: '50%',
  whiteSpace: 'nowrap',
  textTransform: 'none',
  display: 'flex',
  justifyContent: 'center',
  columnGap: '10px',
  [theme.breakpoints.down('xs')]: {
    fontSize: '16px',
  },
});

const columnTitleHidden = theme => ({
  [theme.breakpoints.down('xs')]: {
    display: 'none',
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

const noResults = {
  paddingTop: '70px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};
