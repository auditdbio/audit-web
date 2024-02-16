import React, { useState } from 'react';
import { Avatar, Box, Divider, List, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown.js';
import { getRepoOwner } from '../../redux/actions/githubAction.js';

const GithubOwnOrgs = ({ repo, setRepository, inputValue }) => {
  const dispatch = useDispatch();
  const repositories = useSelector(s =>
    s.github.organizationRepositories
      .filter(el => el.owner.login === repo.login)
      .filter(el => el.name.startsWith(inputValue)),
  );
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Avatar
          sx={{ width: '25px', height: '25px' }}
          size={'small'}
          src={repo.avatar_url}
        />
        <Typography onClick={() => setIsOpen(!isOpen)} sx={{ width: '100%' }}>
          {repo.login}
        </Typography>
        <ArrowDropDownIcon />
      </Box>
      {isOpen && (
        <List sx={listWrapper}>
          {repositories.map((repo, index) => (
            <Box
              key={index}
              onClick={() => {
                dispatch(getRepoOwner(repo.full_name));
                setRepository(repo.full_name);
              }}
              sx={{
                marginLeft: '10px',
                cursor: 'pointer',
                padding: '5px',
                borderBottom: '1px solid #b4b0b0',
                display: 'flex',
                gap: '20px',
                alignItems: 'center',
                '&:hover': { backgroundColor: '#fbfbfb' },
              }}
            >
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
              <Divider />
            </Box>
          ))}
        </List>
      )}
    </Box>
  );
};

export default GithubOwnOrgs;

const listWrapper = theme => ({
  display: 'flex',
  flexDirection: 'column',
  overflowY: 'auto',
  gap: '5px',
  paddingRight: '14px',
  overflowX: 'hidden',
  [theme.breakpoints.down('sm')]: {
    paddingRight: '5px',
  },
});
