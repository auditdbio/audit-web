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
  clearCommit,
  clearRepoOwner,
  getCommitData,
  getCommits,
  getDefaultBranch,
  getMyGithub,
  getMyGithubOrgs,
  getMyPublicGithubOrgs,
  getRepoOwner,
  getTotalCommits,
} from '../../redux/actions/githubAction.js';
import CommitIcon from '@mui/icons-material/Commit';
import dayjs from 'dayjs';
import { getMyProfile, logout } from '../../redux/actions/userAction.js';
import GithubOwnRepositories from './GithubOwnRepositories.jsx';
import GithubOwnOrgs from './GithubOwnOrgs.jsx';
import GitHubAuthComponent from './GitHubAuthComponent.jsx';
import {
  CONNECT_ACCOUNT,
  NEXT_PAGE,
  PREV_PAGE,
} from '../../redux/actions/types.js';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CommitModal from './CommitModal.jsx';
import CommitsList from './CommitsList.jsx';
import Loader from '../Loader.jsx';

const GITHUB_ID = import.meta.env.VITE_GITHUB_CLIENT_ID;
const BASE_URL = import.meta.env.VITE_BASE_URL;

const GithubSelection = ({ project }) => {
  const [field, _, fieldHelper] = useField('scope');
  const [urlRepo, setUrlRepo] = useState('');
  const { branch } = useSelector(state => state.github);
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState([]);
  const {
    defaultBranch,
    totalCommitsPage,
    commits,
    myOrganizations,
    myRepositories,
    sha,
    repoOwner,
    commitInfo,
    commitPage: page,
  } = useSelector(state => state.github);
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
      const validUrl = parseGitHubUrl(getRepoUrl);
      if (getRepoUrl.includes('github.com/')) {
        setRepository(validUrl);
      }
    }
  }, []);

  useEffect(() => {
    if (repository && defaultBranch) {
      dispatch(getCommits(repository, branch, page));
    }
  }, [page, repository, defaultBranch, branch]);

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
      if (githubData?.scope.includes('repo')) {
        dispatch(getMyGithubOrgs());
      } else {
        dispatch(getMyPublicGithubOrgs(githubData.username));
      }
    }
  }, [githubData?.scope.includes('repo')]);

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

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleReset = () => {
    setRepository(null);
    setUrlRepo('');
    fieldHelper.setValue([]);
    dispatch(clearRepoOwner());
    dispatch(clearCommit());
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

  const handleCloseCommit = () => {
    dispatch(clearCommit());
  };

  return (
    <Box sx={wrapper}>
      <Modal
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalSx}>
          {!sha && (
            <Box sx={{ height: '100%' }}>
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
                  {githubData?.id ? (
                    <>
                      {!githubData?.scope.includes('repo') && (
                        <GitHubAuthComponent
                          desc={
                            'Authenticate via GitHub to select from your private repositories'
                          }
                        />
                      )}
                      <GithubOwnRepositories
                        setRepository={handleOpenOwnRepo}
                        myRepositories={myRepositories}
                        myOrganizations={myOrganizations}
                      />
                    </>
                  ) : (
                    <GitHubAuthComponent />
                  )}
                </Box>
              ) : (
                <CommitsList
                  handleReset={handleReset}
                  handleClose={handleClose}
                  repository={repository}
                />
              )}
            </Box>
          )}
          {sha && (
            <CommitModal
              sha={sha}
              selected={selected}
              setSelected={setSelected}
              handleCloseCommit={handleCloseCommit}
              repository={repository}
              onClose={handleClose}
              handleSwitchRep={handleReset}
            />
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

const wrapper = theme => ({
  height: '100%',
  [theme.breakpoints.down(500)]: {
    width: '100%',
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
  height: '90%',
  zIndex: 44,
  [theme.breakpoints.down('sm')]: {
    width: '90%',
    padding: 2,
  },
});
