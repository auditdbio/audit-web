import React, { useState, useEffect } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { CircularProgress, InputAdornment } from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';

const GithubBranchAutocomplete = ({ onClick, repository }) => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  let currentPage = 1;

  const fetchInitialBranches = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://api.github.com/repos/${repository}/branches?per_page=50`,
      );
      const data = await response.json();
      setBranches(data.map(branch => branch.name));
    } catch (error) {
      console.error('Error fetching branches:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (branches.length === 0) {
      fetchInitialBranches();
    }
  }, [branches]); // Run only on the initial render

  useEffect(() => {
    const delayedFetchBranches = setTimeout(() => {
      const fetchBranches = async () => {
        try {
          setLoading(true);
          const response = await fetch(
            `https://api.github.com/repos/${repository}/branches?q=${inputValue}&per_page=100&page=${currentPage}`,
          );
          const data = await response.json();
          setBranches(prevBranches =>
            [...prevBranches, ...data.map(branch => branch.name)].filter(
              (value, index, self) => self.indexOf(value) === index,
            ),
          );

          if (data.length === 100) {
            currentPage++;
            fetchBranches();
          }
        } catch (error) {
          console.error('Error fetching branches:', error);
        } finally {
          setLoading(false);
        }
      };

      setBranches([]);
      currentPage = 1;

      if (inputValue.trim() !== '') {
        fetchBranches();
      }
    }, 500); // 500 milliseconds delay

    return () => clearTimeout(delayedFetchBranches);
  }, [inputValue, repository]);

  return (
    <Autocomplete
      freeSolo
      options={branches}
      loading={loading}
      disableClearable
      sx={fieldSx}
      getOptionLabel={option => option}
      onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
      onChange={(event, newValue) => {
        if (newValue) {
          onClick(newValue);
        }
      }}
      renderInput={params => (
        <TextField
          {...params}
          label="Search branches"
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : (
                  <InputAdornment position="start">
                    <SearchOutlinedIcon style={{ color: '#6a737d' }} />
                  </InputAdornment>
                )}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
};

export default GithubBranchAutocomplete;

const fieldSx = theme => ({
  maxWidth: '400px',
  width: '100%',
  '& label': { top: '-5px' },
  [theme.breakpoints.down('xs')]: {
    maxWidth: '100%',
  },
});
