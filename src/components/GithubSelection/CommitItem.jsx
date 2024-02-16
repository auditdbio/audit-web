import React, { useEffect, useState } from 'react';
import { Avatar, Box, Modal, Typography } from '@mui/material';
import CommitModal from './CommitModal.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { clearCommit } from '../../redux/actions/githubAction.js';

const CommitItem = ({ commit, repository, handleCloseModal }) => {
  const { commitInfo } = useSelector(state => state.github);

  const [open, setOpen] = useState(commitInfo.sha === commit.sha || false);
  const dispatch = useDispatch();

  const handleOpenCommit = () => {
    setOpen(true);
  };

  const handleClose = () => {
    handleCloseModal();
    setOpen(false);
  };

  const handleCloseCommit = () => {
    dispatch(clearCommit());
    setOpen(false);
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
            <Typography
              sx={{
                fontSize: '16px',
                fontWeight: 600,
              }}
            >
              {commit.commit.message}
            </Typography>
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
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal"
        aria-describedby="modal-modal"
      >
        <CommitModal
          sha={commit.sha}
          handleCloseCommit={handleCloseCommit}
          repository={repository}
          onClose={handleClose}
        />
      </Modal>
    </>
  );
};

export default CommitItem;

const authorTitle = theme => ({
  fontSize: '13px',
  color: '#777575',
});
