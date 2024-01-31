import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  Modal,
  Select,
  Tooltip,
  List,
  Typography,
  Divider,
  InputAdornment,
  IconButton,
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import axios from 'axios';
import { Field, useField } from 'formik';
import { linkShortener } from '../custom/CustomLink.jsx';
import GithubBranchAutocomplete from '../GithubBranchAutocomplete.jsx';
import CommitItem from './CommitItem.jsx';
import dayjs from 'dayjs';
import { TextField } from 'formik-mui';
import { addTestsLabel } from '../../lib/helper.js';
import { AUDITOR } from '../../redux/actions/types.js';
import AddIcon from '@mui/icons-material/Add.js';
import CustomSnackbar from '../custom/CustomSnackbar.jsx';
import { useDispatch, useSelector } from 'react-redux';
import {
  clearRepoOwner,
  getCommits,
  getDefaultBranch,
  getMyGithub,
  getRepoOwner,
  getTotalCommits,
} from '../../redux/actions/githubAction.js';

const GithubSelection = () => {
  const [urlRepo, setUrlRepo] = useState('');
  const [branch, setBranch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { defaultBranch, totalCommits, commits, myRepositories } = useSelector(
    state => state.github,
  );
  const [page, setPage] = useState(1);
  const [repository, setRepository] = useState(null);
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const githubData = useSelector(s =>
    s.user.user.linked_accounts.find(el => el.name.toLowerCase() === 'github'),
  );

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
      dispatch(getTotalCommits(repository, branch));
    }
  }, [repository, branch]);

  useEffect(() => {
    if (githubData?.username && !myRepositories?.length) {
      dispatch(getMyGithub(githubData.username));
    }
  }, [githubData?.username]);

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

  const handleClose = () => {
    setIsOpen(false);
    setRepository(null);
    setUrlRepo('');
    setBranch('');
    setPage(1);
    dispatch(clearRepoOwner());
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
                  // size={size}
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
              <Typography
                variant={'h4'}
                sx={{ marginY: '15px', fontSize: '26px' }}
              >
                My repositories:
              </Typography>
              <Divider />
              <List sx={[listWrapper, { marginLeft: '-10px' }]}>
                {myRepositories?.map(repo => {
                  return (
                    <Box
                      onClick={() => {
                        setRepository(repo.full_name);
                        dispatch(getRepoOwner(repo.full_name));
                      }}
                      key={repo.id}
                      sx={{
                        cursor: 'pointer',
                        padding: '5px',
                        paddingLeft: '20px',
                        '&:hover': { backgroundColor: '#fbfbfb' },
                      }}
                    >
                      <Typography>{repo.full_name}</Typography>
                    </Box>
                  );
                })}
              </List>
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
              </Box>
              <Box sx={fieldWrapper}>
                <GithubBranchAutocomplete
                  onClick={setBranch}
                  repository={repository}
                  defaultBranch={defaultBranch}
                  branch={branch}
                />
              </Box>
              <Typography>Commits:</Typography>
              <Divider />
              <List sx={listWrapper}>
                {commits?.map((commit, idx) => {
                  return (
                    <Box key={commit.sha}>
                      {(dayjs(
                        dayjs(commit.commit.committer.date).format(
                          'YYYY-MM-DD',
                        ),
                      ).diff(
                        dayjs(commits?.[idx + 1]?.commit.committer.date).format(
                          'YYYY-MM-DD',
                        ),
                        'day',
                      ) > 0 ||
                        idx === 0) && (
                        <Typography
                          variant={'subtitle2'}
                          color={'primary'}
                          align={'center'}
                        >
                          {dayjs(commit.commit.committer.date).format(
                            'DD MMMM YYYY',
                          )}
                        </Typography>
                      )}
                      <CommitItem commit={commit} repository={repository} />
                    </Box>
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
                {totalCommits > 1 && (
                  <Button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                  >
                    Prev
                  </Button>
                )}
                {totalCommits > 1 && (
                  <Button
                    disabled={page === totalCommits}
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
  gap: '10px',
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
