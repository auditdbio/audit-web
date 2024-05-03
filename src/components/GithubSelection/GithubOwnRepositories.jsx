import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Avatar,
  Box,
  CircularProgress,
  Divider,
  InputAdornment,
  List,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import GithubOwnOrgs from './GithubOwnOrgs.jsx';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined.js';
import TextField from '@mui/material/TextField';
import { getRepoOwner } from '../../redux/actions/githubAction.js';

const GithubOwnRepositories = ({
  setRepository,
  myRepositories,
  myOrganizations,
}) => {
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState('');
  const [tabValue, setTabValue] = useState(1);

  return (
    <>
      <Typography variant={'h4'} sx={{ marginY: '15px', fontSize: '26px' }}>
        My repositories:
      </Typography>
      <Box sx={actionWrapper}>
        <TextField
          sx={fieldSx}
          label="Search in repositories"
          variant="outlined"
          size={'small'}
          onChange={e => setInputValue(e.target.value)}
          InputProps={{
            endAdornment: (
              <>
                <InputAdornment position="start">
                  <SearchOutlinedIcon style={{ color: '#6a737d' }} />
                </InputAdornment>
              </>
            ),
          }}
        />
        <Tabs
          value={tabValue}
          onChange={(_, newValue) => setTabValue(newValue)}
          sx={{
            minHeight: '30px',
            '& button': {
              padding: '3px',
              textTransform: 'unset',
              minWidth: '45px',
              marginX: '5px',
              minHeight: '20px',
            },
            '& span': {
              bottom: '2px',
            },
          }}
        >
          <Tab label="All" value={1} />
          <Tab label="Repository" value={2} />
          <Tab label="Organization" value={3} />
        </Tabs>
      </Box>
      <Divider />
      <List sx={[listWrapper, { marginX: '0px!important' }]}>
        {typeof myOrganizations?.message !== 'string' &&
          tabValue !== 2 &&
          myOrganizations
            ?.filter(el => el.login?.startsWith(inputValue))
            ?.map(org => {
              return (
                <Box
                  key={org.id}
                  sx={{
                    cursor: 'pointer',
                    padding: '5px',
                    borderBottom: '1px solid #b4b0b0',
                  }}
                >
                  <GithubOwnOrgs
                    setRepository={setRepository}
                    repo={org}
                    inputValue={inputValue}
                  />
                </Box>
              );
            })}
        {tabValue !== 3 &&
          myRepositories
            ?.filter(el => el?.name?.startsWith(inputValue))
            .map(repo => {
              return (
                <Box
                  onClick={() => {
                    if (repo.full_name) {
                      dispatch(getRepoOwner(repo.full_name));
                      setRepository(repo.full_name);
                    }
                  }}
                  key={repo.id}
                  sx={{
                    cursor: 'pointer',
                    padding: '5px',
                    borderBottom: '1px solid #b4b0b0',
                    display: 'flex',
                    gap: '20px',
                    alignItems: 'center',
                    '&:hover': { backgroundColor: '#fbfbfb' },
                  }}
                >
                  <>
                    {repo.private ? (
                      <Typography sx={{ color: '#52176D', fontWeight: 600 }}>
                        Private
                      </Typography>
                    ) : (
                      <Typography sx={{ color: '#FF9900', fontWeight: 600 }}>
                        Public
                      </Typography>
                    )}
                    <Typography>{repo.name}</Typography>
                  </>
                </Box>
              );
            })}
      </List>
    </>
  );
};

export default GithubOwnRepositories;

const actionWrapper = theme => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '15px',
  gap: '20px',
  [theme.breakpoints.down('xs')]: {
    flexDirection: 'column',
  },
});

const fieldSx = theme => ({
  width: '400px',
  [theme.breakpoints.down('md')]: {
    width: '300px',
  },
  [theme.breakpoints.down('xs')]: {
    width: '100%',
  },
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
