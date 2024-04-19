import React, { useState, useEffect } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import {
  Box,
  Button,
  CircularProgress,
  ClickAwayListener,
  InputAdornment,
  Typography,
} from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import GithubBranchIcon from './icons/GithubBranchIcon.jsx';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useDispatch, useSelector } from 'react-redux';
import { getBranches, getCommits } from '../redux/actions/githubAction.js';
import {
  BRANCH_NAME,
  CLEAR_COMMIT,
  CLEAR_COMMITINFO,
} from '../redux/actions/types.js';

const GithubBranchAutocomplete = ({ repository, needSave, handleReset }) => {
  const branches = useSelector(state => state.github.branches);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [open, setOpen] = React.useState(false);
  const dispatch = useDispatch();
  const { repoOwner } = useSelector(state => state.github);
  const { branch, defaultBranch, sha } = useSelector(state => state.github);

  useEffect(() => {
    if (!branches.length) {
      if (repository) {
        dispatch(getBranches(repository));
      } else if (!repository && repoOwner) {
        dispatch(getBranches(repoOwner));
      }
    }
  }, [repository]);

  const handleClick = () => {
    setOpen(prev => !prev);
  };

  const handleClickAway = () => {
    setInputValue('');
    setOpen(false);
  };

  const handleChoose = branch => {
    dispatch(getCommits(repository || repoOwner, branch, 1));
    dispatch({ type: BRANCH_NAME, payload: branch });
    dispatch({ type: CLEAR_COMMITINFO });
    dispatch({ type: CLEAR_COMMIT });
    // if (needSave) {
    //   localStorage.setItem('sha', sha);
    //   dispatch({ type: CLEAR_COMMITINFO });
    // }
    handleClickAway();
  };

  useEffect(() => {
    if (repository && !branch && defaultBranch) {
      dispatch(getCommits(repository, defaultBranch));
    }
  }, [defaultBranch]);

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box sx={wrapperSx}>
        <Box sx={{ position: 'relative', maxWidth: '100%' }}>
          <Button sx={buttonSx} variant={'contained'} onClick={handleClick}>
            <GithubBranchIcon />
            <Typography sx={branchTitleSx} noWrap={true} variant={'body2'}>
              {branch ? branch : defaultBranch}
            </Typography>
            <ArrowDropDownIcon />
          </Button>
          {open ? (
            <Box sx={modalWrapper}>
              <TextField
                sx={fieldSx}
                label="Select a branch"
                variant="outlined"
                size={'small'}
                onChange={e => setInputValue(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <>
                      {loading ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : (
                        <InputAdornment position="start">
                          <SearchOutlinedIcon style={{ color: '#6a737d' }} />
                        </InputAdornment>
                      )}
                    </>
                  ),
                }}
              />
              <Box
                sx={{ height: '100%', maxHeight: '350px', overflowY: 'auto' }}
              >
                {branches
                  ?.filter(branch => branch.includes(inputValue))
                  ?.map((branchItem, idx) => (
                    <Box
                      key={idx + branch}
                      onClick={() => handleChoose(branchItem)}
                      sx={[
                        {
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          py: 1,
                          px: 2,
                          overflowX: 'auto',
                          border: '0.5px solid #d9d9d9',
                          '&:hover': {
                            bgcolor: '#f1f8ff',
                          },
                        },
                      ]}
                    >
                      <Box>{branchItem}</Box>
                    </Box>
                  ))}
              </Box>
            </Box>
          ) : null}
        </Box>
        <Button
          sx={buttonSx}
          color={'secondary'}
          variant={'contained'}
          onClick={handleReset}
        >
          Switch repository
        </Button>
      </Box>
    </ClickAwayListener>
  );
};

export default GithubBranchAutocomplete;

const buttonSx = theme => ({
  textTransform: 'unset',
  display: 'flex',
  gap: '5px',
  fontSize: '14px!important',
  lineHeight: '22px',
  maxWidth: '100%',
});

const wrapperSx = theme => ({
  display: 'flex',
  gap: '15px',
  flexWrap: 'wrap',
  [theme.breakpoints.down('sm')]: {
    maxWidth: '100%',
  },
  [theme.breakpoints.down('xs')]: {
    gap: '10px',
  },
});

const fieldSx = theme => ({
  maxWidth: '400px',
  width: '100%',
  '& .MuiAutocomplete-popper': {
    borderRadius: '0!important',
  },
  [theme.breakpoints.down('xs')]: {
    maxWidth: '100%',
  },
});

const branchTitleSx = theme => ({
  fontSize: '14px!important',
  // [theme.breakpoints.down('xs')]: {
  //   maxWidth: '300px',
  // },
  // [theme.breakpoints.down(500)]: {
  //   maxWidth: '200px',
  // },
});

const modalWrapper = theme => ({
  position: 'absolute',
  top: '40px',
  width: '350px',
  left: 0,
  zIndex: 777,
  p: 1,
  bgcolor: '#f8f8f8',
  border: '1px solid #e1e1e1',
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  [theme.breakpoints.down(450)]: {
    width: '300px',
  },
});