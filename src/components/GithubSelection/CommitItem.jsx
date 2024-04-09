import React, { useEffect, useState } from 'react';
import { Avatar, Box, Modal, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { GET_SHA } from '../../redux/actions/types.js';

const CommitItem = ({ commit, repository, handleCloseModal }) => {
  const dispatch = useDispatch();
  const handleOpenCommit = () => {
    dispatch({ type: GET_SHA, payload: commit.sha });
  };

  return (
    <>
      <Box
        onClick={handleOpenCommit}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px',
        }}
      >
        <Box>
          <Box>
            <Typography sx={titleSx}>{commit.commit.message}</Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              gap: '7px',
              marginTop: '7px',
              alignItems: 'center',
            }}
          >
            <Avatar
              sx={{ width: 24, height: 24 }}
              alt="Remy Sharp"
              src={commit?.author?.avatar_url}
            />
            <Typography variant={'h5'} sx={authorTitle}>
              {commit.commit.author.name}
            </Typography>
          </Box>
        </Box>
        <Typography variant={'caption'}>{commit.sha.slice(0, 7)}</Typography>
      </Box>
    </>
  );
};

export default CommitItem;

const titleSx = theme => ({
  fontSize: '14px!important',
  fontWeight: 600,
  [theme.breakpoints.down('xs')]: {
    fontSize: '12px!important',
    overflowWrap: 'anywhere',
  },
});

const authorTitle = theme => ({
  fontSize: '13px',
  color: '#777575',
});
