import React, { useEffect, useMemo, useState } from 'react';
import { Box, FormControl, InputLabel, Select, Tooltip } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import axios from 'axios';
import { useField } from 'formik';
import { linkShortener } from '../custom/CustomLink.jsx';

const GithubSelection = () => {
  const [field, meta] = useField('scope');
  const [branches, setBranches] = useState([]);
  const [commits, setCommits] = useState([]);
  const [branch, setBranch] = useState('');
  const [commit, setCommit] = useState(null);

  const repository = useMemo(() => {
    if (field.value.some(el => el.includes('github.com/'))) {
      const project = field?.value?.find(el => el.includes('github.com/'));
      return linkShortener(project);
    } else {
      return null;
    }
  }, [field?.value]);

  useEffect(() => {
    // if (!!repository) {
    axios(`https://api.github.com/repos/${repository}/branches`)
      .then(({ data }) => {
        setBranches(data); // Обработка списка репозиториев
        console.log(data); // Обработка списка репозиториев
      })
      .catch(error => {
        console.error(error); // Обработка ошибок
      });
    // }
  }, [repository]);

  useEffect(() => {
    axios(
      `https://api.github.com/repos/auditdbio/audit-web/commits?sha=${branch}`,
    )
      .then(({ data }) => {
        setCommits(data); // Обработка списка репозиториев
        console.log(data); // Обработка списка репозиториев
      })
      .catch(error => {
        console.error(error); // Обработка ошибок
      });
  }, [branch]);

  const handleChange = event => {
    setBranch(event.target.value);
  };

  const handleChangeCommits = event => {
    setCommit(event.target.value);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        gap: '25px',
      }}
    >
      <Tooltip
        title={!repository ? 'Please add your github project' : ''}
        placement={'top'}
      >
        <FormControl fullWidth size={'small'}>
          <InputLabel id="demo-simple-select-label">Branches</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            value={branch}
            label="Branches"
            disabled={!repository}
            onChange={handleChange}
          >
            {branches?.map(el => (
              <MenuItem
                sx={{ maxWidth: '500px', overflow: 'auto' }}
                key={el.name}
                value={el.name}
              >
                {el.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Tooltip>
      <Tooltip
        title={!repository ? 'Please add your github project' : ''}
        placement={'top'}
      >
        <FormControl fullWidth size={'small'}>
          <InputLabel id="commits-simple-select-label">Commits</InputLabel>
          <Select
            labelId="commits-simple-select-label"
            value={commit?.commit?.message}
            label="Commits"
            disabled={!repository}
            onChange={handleChangeCommits}
          >
            {commits?.map(el => (
              <MenuItem
                key={el.sha}
                sx={{ maxWidth: '500px', overflow: 'auto' }}
                value={el}
              >
                {el.commit.message}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Tooltip>
    </Box>
  );
};

export default GithubSelection;
