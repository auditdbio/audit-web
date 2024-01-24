import React, { useState } from 'react';
import { Avatar, Box, Modal, Typography } from '@mui/material';
import CommitModal from './CommitModal.jsx';

const CommitItem = ({ commit, repository }) => {
  const [open, setOpen] = useState(false);
  const handleOpenCommit = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box
      sx={{
        cursor: 'pointer',
        padding: '5px',
        paddingLeft: '20px',
        '&:hover': { backgroundColor: '#fbfbfb' },
      }}
    >
      <Box onClick={handleOpenCommit}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
            marginBottom: '5px',
            '& p': {
              fontSize: '16px',
              fontWeight: 500,
            },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: '10px',
              width: '100%',
            }}
          >
            <Typography>{commit.commit.message}</Typography>
            <Typography variant={'caption'}>
              {commit.sha.slice(0, 7)}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: '7px', alignItems: 'center' }}>
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
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal"
        aria-describedby="modal-modal"
      >
        <CommitModal
          sha={commit.sha}
          repository={repository}
          onClose={handleClose}
        />
      </Modal>
    </Box>
  );
};

export default CommitItem;

const authorTitle = theme => ({
  fontSize: '13px',
  color: '#777575',
});
