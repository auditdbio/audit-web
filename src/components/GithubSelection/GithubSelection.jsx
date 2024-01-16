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

const GithubSelection = () => {
  const [urlRepo, setUrlRepo] = useState('');
  const [commits, setCommits] = useState([]);
  const [branch, setBranch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [defaultBranch, setDefaultBranch] = useState('');
  const [page, setPage] = useState(1);
  const [totalCommits, setTotalCommits] = useState(0);
  const [repository, setRepository] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const getTotalCommitsCount = async branch => {
      try {
        let pageCount = 1;
        let totalCount = 0;

        while (true) {
          const response = await axios.get(
            `https://api.github.com/repos/${repository}/commits`,
            {
              params: {
                sha: branch,
                per_page: 100,
                page: pageCount,
              },
            },
          );

          const linkHeader = response.headers.link;
          if (!linkHeader || !linkHeader.includes('rel="last"')) {
            totalCount += response.data.length;
            break;
          }

          const matches = linkHeader.match(/&page=(\d+)>; rel="last"/);
          const lastPage = matches ? parseInt(matches[1]) : 1;

          if (pageCount >= lastPage) {
            totalCount += response.data.length;
            break;
          }

          totalCount += response.data.length;
          pageCount++;
        }
        setTotalCommits(Math.floor(totalCount / 100) + 1);
      } catch (error) {
        console.error('Error fetching commits:', error);
      }
    };

    if (repository) {
      getTotalCommitsCount(branch);
    }
  }, [repository, branch]);

  useEffect(() => {
    if (repository) {
      axios(`https://api.github.com/repos/${repository}`).then(({ data }) =>
        setDefaultBranch(data.default_branch),
      );
      axios(
        `https://api.github.com/repos/${repository}/commits?sha=${branch}&per_page=50&page=${page}`,
      )
        .then(({ data }) => {
          setCommits(data); // Обработка списка репозиториев
        })
        .catch(error => {
          console.error(error); // Обработка ошибок
        });
    }
  }, [branch, page, repository]);

  const handleAddProject = () => {
    if (urlRepo.includes('github.com/')) {
      setRepository(linkShortener(urlRepo));
    } else {
      setError('Please enter a valid Github repository url');
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setRepository(null);
    setUrlRepo('');
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
                  // onBlur={handleBlur}
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
                />
                <Typography>
                  Branch: {branch ? branch : defaultBranch}
                </Typography>
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
  [theme.breakpoints.down('xs')]: {
    flexDirection: 'column',
    gap: '10px',
  },
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
