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
import { getBranches } from '../redux/actions/githubAction.js';

const GithubBranchAutocomplete = ({
  onClick,
  repository,
  defaultBranch,
  branch,
}) => {
  const branches = useSelector(state => state.github.branches);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [open, setOpen] = React.useState(false);
  const dispatch = useDispatch();
  const { repoOwner } = useSelector(state => state.github);

  useEffect(() => {
    if (repository !== repoOwner || !branches.length) {
      dispatch(getBranches(repository));
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
    onClick(branch);
    handleClickAway();
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box sx={{ position: 'relative' }}>
        <Button
          sx={{ textTransform: 'unset', display: 'flex', gap: '5px' }}
          variant={'contained'}
          onClick={handleClick}
        >
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
              label="Search branches"
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
            <Box sx={{ height: '100%', maxHeight: '350px', overflowY: 'auto' }}>
              {branches
                ?.filter(branch => branch.includes(inputValue))
                ?.map((branch, idx) => (
                  <Box
                    key={idx + branch}
                    onClick={() => handleChoose(branch)}
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
                    <Box>{branch}</Box>
                  </Box>
                ))}
            </Box>
          </Box>
        ) : null}
      </Box>
    </ClickAwayListener>
  );
};

export default GithubBranchAutocomplete;

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
  [theme.breakpoints.down('xs')]: {
    maxWidth: '300px',
  },
  [theme.breakpoints.down(500)]: {
    maxWidth: '200px',
  },
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
