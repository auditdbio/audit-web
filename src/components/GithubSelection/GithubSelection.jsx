import React, { useEffect, useState } from 'react';
import { Box, Button, Modal, Typography } from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { Field, useField } from 'formik';
import { TextField } from 'formik-mui';
import { addTestsLabel } from '../../lib/helper.js';
import CustomSnackbar from '../custom/CustomSnackbar.jsx';
import { useDispatch, useSelector } from 'react-redux';
import {
  clearCommit,
  clearRepoOwner,
  getCommits,
  getDefaultBranch,
  getGithubPublicRepos,
  getMyGithub,
  getMyGithubOrgs,
  getMyPublicGithubOrgs,
  getRepoOwner,
  getTotalCommits,
} from '../../redux/actions/githubAction.js';
import { getMyProfile } from '../../redux/actions/userAction.js';
import GithubOwnRepositories from './GithubOwnRepositories.jsx';
import GitHubAuthComponent from './GitHubAuthComponent.jsx';
import CommitModal from './CommitModal.jsx';
import CommitsList from './CommitsList.jsx';
import {
  CLEAR_NOT_FOUND_ERROR,
  SWITCH_REPO,
} from '../../redux/actions/types.js';
import { SCOPE_GIT_BLOCK, SCOPE_LINKS } from '../../services/constants.js';

const GithubSelection = ({
  project,
  noPrivate,
  isOpen,
  setIsOpen,
  clearRepo,
}) => {
  const dispatch = useDispatch();
  const [field, _, fieldHelper] = useField('scope');
  const [urlRepo, setUrlRepo] = useState('');
  const [selected, setSelected] = useState([]);
  const [repository, setRepository] = useState(null);
  const [error, setError] = useState('');

  const {
    branch,
    defaultBranch,
    myOrganizations,
    myRepositories,
    sha,
    notFound,
    commitPage: page,
  } = useSelector(state => state.github);
  const githubData = useSelector(s =>
    s.user?.user?.linked_accounts?.find(
      el => el?.name?.toLowerCase() === 'github',
    ),
  );

  useEffect(() => {
    if (isOpen) {
      if (field.value.type === SCOPE_LINKS) {
        setSelected(field.value.content);
      } else if (field.value.type === SCOPE_GIT_BLOCK) {
        setSelected(field.value.content.files);
      }
    }
  }, [isOpen]);

  useEffect(() => {
    if (project?.id) {
      function parseGitHubUrl(gitHubUrl) {
        const urlParts = gitHubUrl.split('/');
        const owner = urlParts[3];
        const repo = urlParts[4];

        return `${owner}/${repo}`;
      }

      if (field.value.type === SCOPE_LINKS) {
        const getRepoUrl = field.value.content[0];
        if (getRepoUrl) {
          const validUrl = parseGitHubUrl(getRepoUrl);
          if (getRepoUrl.includes('github.com/')) {
            setRepository(validUrl);
          }
        }
      } else if (field.value.type === SCOPE_GIT_BLOCK) {
        if (field.value?.content?.repository?.clone_url) {
          const validUrl = parseGitHubUrl(
            field.value.content.repository.clone_url,
          );
          setRepository(validUrl);
        }
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
    if (githubData?.id && githubData?.username) {
      if (githubData?.scope?.includes('repo') && !noPrivate) {
        dispatch(getMyGithubOrgs());
        dispatch(getMyGithub());
      } else {
        dispatch(getGithubPublicRepos(githubData.username));
        dispatch(getMyPublicGithubOrgs(githubData.username));
      }
    }
  }, [githubData?.scope?.includes('repo'), githubData?.username]);

  const handleAddProject = () => {
    if (urlRepo.includes('github.com/')) {
      function parseGitHubUrl(gitHubUrl) {
        const url = gitHubUrl.replace(/^https?:\/\//, '');
        const urlParts = url.split('/');

        const owner = urlParts[1];
        const repo = urlParts[2];

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

    setSelected([]);
    fieldHelper.setValue({
      type: SCOPE_GIT_BLOCK,
      content: {
        repository: {
          clone_url: null,
        },
        commit: null,
        files: [],
      },
    });

    dispatch(clearRepoOwner());
    dispatch(clearCommit());
    dispatch({ type: SWITCH_REPO });
    dispatch({ type: CLEAR_NOT_FOUND_ERROR });
  };

  useEffect(() => {
    if (clearRepo === 'clear') {
      handleReset();
    }
  }, [clearRepo]);

  useEffect(() => {
    const handleStorageChange = event => {
      if (
        event.key === 'authenticated' &&
        event.newValue === 'true' &&
        !noPrivate
      ) {
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
                    {!githubData?.scope?.includes('repo') && (
                      <GitHubAuthComponent
                        noPrivate={noPrivate}
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
              <>
                {!notFound ? (
                  <CommitsList
                    handleReset={handleReset}
                    handleClose={handleClose}
                    repository={repository}
                  />
                ) : (
                  <Box sx={notFoundSx}>
                    <Button
                      sx={{
                        marginLeft: '-15px',
                        minWidth: '34px',
                        marginBottom: '5px',
                        alignSelf: 'flex-start',
                      }}
                      onClick={() => {
                        handleClose();
                        dispatch({ type: CLEAR_NOT_FOUND_ERROR });
                        handleReset();
                      }}
                    >
                      <CloseRoundedIcon />
                    </Button>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                      }}
                    >
                      <Typography variant={'h4'}>
                        Repository not found
                      </Typography>
                      <Button
                        sx={buttonSx}
                        color={'primary'}
                        variant={'contained'}
                        onClick={handleReset}
                      >
                        Switch repository
                      </Button>
                    </Box>
                  </Box>
                )}
              </>
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
  );
};

export default GithubSelection;

const notFoundSx = theme => ({
  display: 'flex',
  height: '100%',
  alignItems: 'center',
  flexDirection: 'column',
  '& h4': {
    fontSize: '28px',
  },
  [theme.breakpoints.down('sm')]: {
    '& h4': {
      fontSize: '22px',
    },
  },
});

const buttonSx = {
  textTransform: 'unset',
  display: 'flex',
  gap: '5px',
  fontSize: '14px!important',
  lineHeight: '22px',
  maxWidth: '100%',
  marginTop: '25px',
};

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

const fieldSx = {
  maxWidth: '500px',
  width: '100%',
};

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
