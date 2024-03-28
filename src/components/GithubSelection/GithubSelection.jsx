import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Divider,
  List,
  Modal,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { Field, useField } from 'formik';
import GithubBranchAutocomplete from '../GithubBranchAutocomplete.jsx';
import CommitItem from './CommitItem.jsx';
import { TextField } from 'formik-mui';
import { addTestsLabel } from '../../lib/helper.js';
import CustomSnackbar from '../custom/CustomSnackbar.jsx';
import { useDispatch, useSelector } from 'react-redux';
import {
  clearRepoOwner,
  getCommits,
  getDefaultBranch,
  getMyGithub,
  getMyGithubOrgs,
  getRepoOwner,
  getTotalCommits,
} from '../../redux/actions/githubAction.js';
import CommitIcon from '@mui/icons-material/Commit';
import dayjs from 'dayjs';
import { getMyProfile, logout } from '../../redux/actions/userAction.js';
import GithubOwnRepositories from './GithubOwnRepositories.jsx';
import GithubOwnOrgs from './GithubOwnOrgs.jsx';
import GitHubAuthComponent from './GitHubAuthComponent.jsx';
import { CONNECT_ACCOUNT } from '../../redux/actions/types.js';

const GITHUB_ID = import.meta.env.VITE_GITHUB_CLIENT_ID;
const BASE_URL = import.meta.env.VITE_BASE_URL;

const GithubSelection = ({ project }) => {
  const [field, _, fieldHelper] = useField('scope');
  const [urlRepo, setUrlRepo] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const {
    defaultBranch,
    totalCommitsPage,
    commits,
    myOrganizations,
    myRepositories,
  } = useSelector(state => state.github);
  const [page, setPage] = useState(1);
  const [repository, setRepository] = useState(null);
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const githubData = useSelector(s =>
    s.user?.user?.linked_accounts?.find(
      el => el?.name?.toLowerCase() === 'github',
    ),
  );
  const orgs = useSelector(s => s.github.myOrganizations);

  useEffect(() => {
    if (project?.id) {
      const getRepoUrl = field.value[0];
      function parseGitHubUrl(gitHubUrl) {
        const urlParts = gitHubUrl.split('/');
        const owner = urlParts[3];
        const repo = urlParts[4];

        return `${owner}/${repo}`;
      }
      setRepository(parseGitHubUrl(getRepoUrl));
    }
  }, []);

  useEffect(() => {
    if (repository && (branch || defaultBranch)) {
      dispatch(getCommits(repository, branch, page));
    }
  }, [repository, branch, page, defaultBranch]);

  useEffect(() => {
    if (repository) {
      dispatch(getDefaultBranch(repository));
    }
  }, [repository]);

  useEffect(() => {
    if (repository && (branch || defaultBranch)) {
      dispatch(getTotalCommits(repository, branch, page));
    }
  }, [repository, branch, page]);

  useEffect(() => {
    if (githubData?.id && !myRepositories?.length) {
      dispatch(getMyGithub());
      dispatch(getMyGithubOrgs());
    }
  }, []);

  const handleAddProject = () => {
    if (urlRepo.includes('github.com/')) {
      function parseGitHubUrl(gitHubUrl) {
        const urlParts = gitHubUrl.split('/');
        const owner = urlParts[3];
        const repo = urlParts[4];

        return `${owner}/${repo}`;
      }
      setRepository(parseGitHubUrl(urlRepo));
      dispatch(getRepoOwner(parseGitHubUrl(urlRepo)));
    } else {
      setError('Please enter a valid Github repository url');
    }
  };

  const handleOpenOwnRepo = urlRepo => {
    setRepository(urlRepo);
    dispatch(getRepoOwner(urlRepo));
  };

  const handleClose = () => setIsOpen(false);

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

  const handleReset = () => {
    setRepository(null);
    setUrlRepo('');
    setBranch('');
    setPage(1);
    fieldHelper.setValue([]);
    dispatch(clearRepoOwner());
  };
  useEffect(() => {
    const handleStorageChange = event => {
      if (event.key === 'authenticated' && event.newValue === 'true') {
        dispatch(getMyProfile());
        dispatch(getMyGithub());
        dispatch(getMyGithubOrgs());
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      localStorage.removeItem('authenticated');
    };
  }, []);

  return (
    <Box sx={wrapper}>
      <Modal
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalSx}>
          {!repository ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
              }}
            >
              <Button
                sx={{
                  marginLeft: '-15px',
                  minWidth: '34px',
                  marginBottom: '5px',
                  alignSelf: 'flex-start',
                }}
                onClick={handleClose}
              >
                <CloseRoundedIcon />
              </Button>
              <Box sx={projectUrlWrapper}>
                <CustomSnackbar
                  autoHideDuration={3000}
                  open={!!error}
                  onClose={() => {
                    setError('');
                  }}
                  severity={'error'}
                  text={error}
                />
                <Field
                  component={TextField}
                  placeholder={'Github repository url'}
                  fullWidth={true}
                  name={'tag-field'}
                  disabled={false}
                  label={'Github repository url'}
                  size={'small'}
                  value={urlRepo}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      handleAddProject();
                    }
                  }}
                  onChange={e => setUrlRepo(e.target.value)}
                  sx={fieldSx}
                  inputProps={{ ...addTestsLabel('project-input') }}
                />
                <Button
                  onClick={handleAddProject}
                  variant={'contained'}
                  sx={btnSx}
                >
                  Submit
                </Button>
              </Box>
              {/*<Box sx={[githubTitleSx, { marginTop: '10px!important' }]}>*/}
              {/*  <Typography variant={'h5'} align={'center'}>*/}
              {/*    To view your repositories, authenticate through GitHub.*/}
              {/*  </Typography>*/}
              {/*  <Button*/}
              {/*    onClick={handleConnectGithub}*/}
              {/*    sx={{ textTransform: 'unset' }}*/}
              {/*    variant={'contained'}*/}
              {/*  >*/}
              {/*    Authenticate with GitHub{' '}*/}
              {/*  </Button>*/}
              {/*</Box>*/}
              {githubData?.id && !orgs.message ? (
                <GithubOwnRepositories
                  setRepository={handleOpenOwnRepo}
                  myRepositories={myRepositories}
                  myOrganizations={myOrganizations}
                />
              ) : (
                <GitHubAuthComponent />
              )}
            </Box>
          ) : (
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
                <Button
                  sx={{
                    marginLeft: '25px',
                    minWidth: '34px',
                    marginBottom: '5px',
                    alignSelf: 'flex-end',
                    fontWeight: 600,
                  }}
                  color={'secondary'}
                  onClick={handleReset}
                >
                  Reset
                </Button>
              </Box>
              <Box sx={fieldWrapper}>
                <GithubBranchAutocomplete
                  onClick={setBranch}
                  repository={repository}
                  defaultBranch={defaultBranch}
                  branch={branch}
                />
              </Box>
              <Divider />
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
                          Commits on{' '}
                          {dayjs(commitObj.date).format('MMM DD, YYYY')}
                        </Typography>
                      </Box>
                      <List>
                        {commitObj.commits.map(commit => {
                          return (
                            <Box
                              key={commit.sha}
                              sx={[
                                wrapperSx,
                                commitObj.commits.length === 1
                                  ? singleSx
                                  : idx === 0
                                  ? firstSx
                                  : idx === commitObj.commits.length - 1
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
                    onClick={() => setPage(page - 1)}
                  >
                    Prev
                  </Button>
                )}
                {totalCommitsPage > 1 && (
                  <Button
                    disabled={page === totalCommitsPage}
                    onClick={() => setPage(page + 1)}
                  >
                    Next
                  </Button>
                )}
              </Box>
            </Box>
          )}
        </Box>
      </Modal>
      <Button
        onClick={() => setIsOpen(true)}
        variant={'contained'}
        sx={githubBtnSx}
      >
        Use github
      </Button>
    </Box>
  );
};

export default GithubSelection;

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

const wrapper = theme => ({
  height: '100%',
  [theme.breakpoints.down(500)]: {
    width: '100%',
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

const githubBtnSx = theme => ({
  padding: '5px',
  height: '100%',
  width: '130px',
  [theme.breakpoints.down('sm')]: {
    width: '110px',
  },
  [theme.breakpoints.down('xs')]: {
    paddingY: '9px',
  },
  [theme.breakpoints.down(500)]: {
    width: '100%',
  },
});

const projectUrlWrapper = theme => ({
  display: 'flex',
  gap: '15px',
  justifyContent: 'center',
  [theme.breakpoints.down(550)]: {
    flexDirection: 'column',
  },
});

const btnSx = theme => ({
  maxWidth: '160px',
  width: '100%',
  fontSize: '18px',
  textTransform: 'unset',
  [theme.breakpoints.down('sm')]: {
    fontSize: '16px',
  },
  [theme.breakpoints.down('xs')]: {
    maxWidth: '120px',
  },
  [theme.breakpoints.down(550)]: {
    maxWidth: '100%',
  },
});

const fieldSx = theme => ({
  maxWidth: '500px',
  width: '100%',
});

const modalSx = theme => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: '10px',
  p: 4,
  paddingTop: '5px!important',
  width: '80%',
  height: '80%',
  zIndex: 44,
  [theme.breakpoints.down('sm')]: {
    width: '90%',
    height: '90%',
    padding: 2,
  },
});

const fieldWrapper = theme => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
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
