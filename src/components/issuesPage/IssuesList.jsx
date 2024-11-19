import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom/dist';
import { Box, Button, useMediaQuery } from '@mui/material';
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
  NAME_DESCENDING,
  NAME_ASCENDING,
} from './constants.js';
import ArrowUpIcon from '../icons/ArrowUpIcon.jsx';
import IssueListItem from './IssueListItem.jsx';
import { clearMessage } from '../../redux/actions/auditAction.js';
import CustomSnackbar from '../custom/CustomSnackbar.jsx';
import theme from '../../styles/themes.js';

const IssuesList = ({
  auditId,
  isPublic,
  setIsOpenReset,
  handleSubmit,
  saved,
  hideControl,
  code,
}) => {
  const dispatch = useDispatch();
  const matchXs = useMediaQuery(theme.breakpoints.down('xs'));
  const [searchParams, setSearchParams] = useSearchParams();

  const { issues } = useSelector(s => s.issues);
  const { user } = useSelector(s => s.user);
  const { successMessage, error } = useSelector(s => s.audits);

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [page, setPage] = useState(+searchParams.get('page') || 1);
  const [sortType, setSortType] = useState(
    searchParams.get('sort') || STATUS_DESCENDING,
  );

  const getNumberOfPages = () => Math.ceil(getSearchResultsLength() / 10);

  const getSearchResultsLength = () => {
    return issues?.filter(issue =>
      issue.name?.toLowerCase().includes(search.toLowerCase()),
    ).length;
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
      case NAME_DESCENDING:
        return b.name.localeCompare(a.name);
      case NAME_ASCENDING:
        return a.name.localeCompare(b.name);
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

  const handleNameSort = () => {
    setPage(1);
    if (sortType === NAME_ASCENDING) {
      setSortType(NAME_DESCENDING);
    } else {
      setSortType(NAME_ASCENDING);
    }
  };

  useEffect(() => {
    setSearchParams(prev => ({
      ...Object.fromEntries(prev.entries()),
      page,
      sort: sortType,
    }));
    return () => dispatch(clearMessage());
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

      {!hideControl && (
        <Control
          issues={issues}
          search={search}
          saved={saved}
          setSearch={setSearch}
          setPage={setPage}
          setSearchParams={setSearchParams}
          isPublic={isPublic}
          setIsOpenReset={setIsOpenReset}
          handleSubmit={handleSubmit}
        />
      )}

      <Box sx={wrapper}>
        <Box sx={issueTitleSx}>
          <Button sx={[columnText, columnTitle]} onClick={handleNameSort}>
            <span>Issue</span>
            <span>
              {sortType === NAME_ASCENDING ? (
                <ArrowUpIcon size={matchXs ? 'small' : 'medium'} />
              ) : (
                <ArrowIcon size={matchXs ? 'small' : 'medium'} />
              )}
            </span>
          </Button>
        </Box>
        <Box sx={columnsTitleBlock}>
          <Box sx={columnStatus}>
            <Button sx={[columnText, columnTitle]} onClick={handleStatusSort}>
              <span>Status</span>
              <span>
                {sortType === STATUS_ASCENDING ? (
                  <ArrowUpIcon size={matchXs ? 'small' : 'medium'} />
                ) : (
                  <ArrowIcon size={matchXs ? 'small' : 'medium'} />
                )}
              </span>
            </Button>
          </Box>
          <Button sx={[columnText, columnTitle]} onClick={handleSeveritySort}>
            <span>Severity</span>
            <span>
              {sortType === SEVERITY_ASCENDING ? (
                <ArrowUpIcon size={matchXs ? 'small' : 'medium'} />
              ) : (
                <ArrowIcon size={matchXs ? 'small' : 'medium'} />
              )}
            </span>
          </Button>
        </Box>
      </Box>

      <Box sx={{ width: '100%' }}>
        {issues
          ?.filter(issue =>
            issue.name?.toLowerCase().includes(search.toLowerCase()),
          )
          .sort(sortFunc)
          .slice((page - 1) * 10, page * 10)
          .map(issue => (
            <IssueListItem
              saved={saved}
              issue={issue}
              key={issue.id}
              auditId={auditId}
              user={user}
              code={code}
              hideControl={hideControl}
              isPublic={isPublic}
            />
          ))}
      </Box>

      {getSearchResultsLength() === 0 && (
        <Box sx={[noResults, isPublic || saved ? { paddingTop: 0 } : {}]}>
          No issue fits the search criteria
        </Box>
      )}

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

const wrapper = theme => ({
  display: 'flex',
  width: '100%',
  justifyContent: 'space-between',
  px: '30px',
  [theme.breakpoints.down('xs')]: {
    px: '20px',
  },
});

const issueTitleSx = {
  display: 'flex',
  '& button': {
    justifyContent: 'flex-start',
  },
};

const columnsTitleBlock = theme => ({
  display: 'flex',
  justifyContent: 'flex-end',
  width: '25%',
  [theme.breakpoints.down(915)]: {
    width: '30%',
  },
});

const columnTitle = {
  whiteSpace: 'nowrap',
  textTransform: 'none',
  letterSpacing: '-0.1mm',
  display: 'flex',
  justifyContent: 'center',
  columnGap: '8px',
};

const columnStatus = theme => ({
  display: 'flex',
  justifyContent: 'center',
  flexGrow: 1,
  [theme.breakpoints.down('xs')]: {
    display: 'none',
  },
});

const columnText = theme => ({
  color: '#434242',
  fontSize: '16px',
  fontWeight: 500,
  lineHeight: '25px',
  padding: '0',
  [theme.breakpoints.down('xs')]: {
    fontSize: '14px',
  },
  [theme.breakpoints.down('xxs')]: {
    fontSize: '12px',
  },
});

const noResults = {
  paddingTop: '70px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};
