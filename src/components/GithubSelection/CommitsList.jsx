import React, { useMemo } from 'react';
import { Box, Button, Divider, List, Typography } from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded.js';
import GithubBranchAutocomplete from '../GithubBranchAutocomplete.jsx';
import CommitIcon from '@mui/icons-material/Commit.js';
import dayjs from 'dayjs';
import CommitItem from './CommitItem.jsx';
import { NEXT_PAGE, PREV_PAGE } from '../../redux/actions/types.js';
import { useSelector } from 'react-redux';
import Loader from '../Loader.jsx';

const CommitsList = ({ handleClose, handleReset, repository }) => {
  const {
    totalCommitsPage,
    commits,
    commitPage: page,
  } = useSelector(state => state.github);

  const newCommits = useMemo(() => {
    const commitsByDate = {};
    commits.forEach(commit => {
      const commitDate = commit.commit.author.date.split('T')[0];

      if (!commitsByDate[commitDate]) {
        commitsByDate[commitDate] = [];
      }

      commitsByDate[commitDate].push({
        ...commit,
      });
    });

    return Object.keys(commitsByDate).map(date => ({
      date,
      commits: commitsByDate[date],
    }));
  }, [commits]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        height: '100%',
      }}
    >
      <Box>
        <Button
          sx={{
            marginLeft: '-15px',
            minWidth: '34px',
            marginBottom: '5px',
          }}
          onClick={handleClose}
        >
          <CloseRoundedIcon />
        </Button>
      </Box>
      <Box sx={fieldWrapper}>
        <GithubBranchAutocomplete
          handleReset={handleReset}
          repository={repository}
        />
      </Box>
      <Divider />
      {commits.length ? (
        <>
          <List sx={listWrapper}>
            {newCommits?.map((commitObj, idx) => {
              return (
                <React.Fragment key={idx}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      paddingLeft: '5px',
                    }}
                  >
                    <CommitIcon color={'primary'} />
                    <Typography
                      variant={'subtitle2'}
                      color={'primary'}
                      sx={{ fontWeight: 600 }}
                    >
                      Commits on {dayjs(commitObj.date).format('MMM DD, YYYY')}
                    </Typography>
                  </Box>
                  <List>
                    {commitObj.commits.map((commit, index) => {
                      return (
                        <Box
                          key={commit.sha}
                          sx={[
                            wrapperSx,
                            commitObj.commits.length === 1
                              ? singleSx
                              : index === 0
                              ? firstSx
                              : index === commitObj.commits.length - 1
                              ? lastSx
                              : middleSx,
                          ]}
                        >
                          <CommitItem
                            commit={commit}
                            repository={repository}
                            handleCloseModal={handleClose}
                          />
                        </Box>
                      );
                    })}
                  </List>
                </React.Fragment>
              );
            })}
          </List>
          <Box
            sx={{
              display: 'flex',
              gap: '15px',
              justifyContent: 'center',
            }}
          >
            {totalCommitsPage > 1 && (
              <Button
                disabled={page === 1}
                onClick={() => dispatch({ type: PREV_PAGE, payload: page - 1 })}
              >
                Prev
              </Button>
            )}
            {totalCommitsPage > 1 && (
              <Button
                disabled={page === totalCommitsPage}
                onClick={() => dispatch({ type: NEXT_PAGE, payload: page + 1 })}
              >
                Next
              </Button>
            )}
          </Box>
        </>
      ) : (
        <Box
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Loader />
        </Box>
      )}
    </Box>
  );
};

export default CommitsList;

const fieldWrapper = theme => ({
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  gap: '20px',
});

const listWrapper = theme => ({
  display: 'flex',
  flexDirection: 'column',
  overflowY: 'auto',
  gap: '5px',
  marginRight: '-30px',
  paddingRight: '14px',
  marginLeft: '-20px',
  overflowX: 'hidden',
  [theme.breakpoints.down('sm')]: {
    marginRight: '-10px',
    paddingRight: '5px',
    marginLeft: '-10px',
  },
});

const middleSx = {
  border: '1px solid',
  borderBottom: 'none',
};

const lastSx = {
  border: '1px solid',
  borderRadius: '0 0 5px 5px',
};

const firstSx = {
  border: '1px solid',
  borderRadius: '5px 5px 0 0',
  borderBottom: 'none',
};

const singleSx = {
  border: '1px solid',
  borderRadius: '5px',
};

const wrapperSx = theme => ({
  cursor: 'pointer',
  padding: '5px',
  paddingX: '15px',
  borderColor: `#c9c9c9!important`,
  '&:hover': { backgroundColor: '#fbfbfb' },
  [theme.breakpoints.down('xs')]: {
    paddingX: '10px',
  },
});

const githubTitleSx = theme => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginTop: '45px',
  gap: '25px',
  '& h5': {
    fontSize: '24px',
    fontWeight: 500,
  },
  '& button': {
    fontSize: '18px',
  },
  [theme.breakpoints.down('md')]: {
    marginTop: '35px',
    gap: '15px',
    '& h5': {
      fontSize: '20px',
    },
    '& button': {
      fontSize: '16px',
    },
  },
  [theme.breakpoints.down('xs')]: {
    '& h5': {
      fontSize: '16px',
    },
  },
  [theme.breakpoints.down(550)]: {
    '& button': {
      width: '100%',
    },
  },
});
