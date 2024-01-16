import React, { useEffect, useState } from 'react';
import { Avatar, Box, Button, Typography } from '@mui/material';
import axios from 'axios';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import dayjs from 'dayjs';
import { useField } from 'formik';
import CustomSnackbar from '../custom/CustomSnackbar.jsx';
import Loader from '../Loader.jsx';

const CommitModal = ({ sha, onClose, repository }) => {
  const [field, meta, fieldHelper] = useField('scope');
  const [data, setData] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  useEffect(() => {
    if (repository) {
      axios(`https://api.github.com/repos/${repository}/commits/${sha}`).then(
        ({ data }) => setData(data),
      );
    }
  }, [repository]);

  const handleAdd = file => {
    fieldHelper.setValue([...field.value, file.blob_url]);
    setModalOpen(true);
  };

  return (
    <Box sx={modalSx}>
      <CustomSnackbar
        autoHideDuration={3000}
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
        }}
        severity={'success'}
        text={'Success! Added to project links'}
      />
      <Box
        sx={{
          backgroundColor: 'white',
          height: '100%',
          padding: '32px 24px 24px',
          borderRadius: '8px',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Button
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            minWidth: '40px',
          }}
          onClick={onClose}
        >
          <CloseRoundedIcon />
        </Button>
        <Typography variant="h4">Commit</Typography>
        <Box>
          <Typography
            variant={'body1'}
            sx={{ fontWeight: 500, overflowWrap: 'break-word' }}
          >
            {data?.commit.message}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              gap: '20px',
              alignItems: 'center',
              marginY: '15px',
            }}
          >
            <Avatar
              sx={{ width: 32, height: 32 }}
              alt={data?.commit.author.name}
              src={data?.author?.avatar_url}
            />
            <Typography>{data?.commit.author.name}</Typography>
            <Typography sx={{ fontSize: '12px' }}>
              {dayjs(data?.commit.author.date).format('DD MMM YYYY')}
            </Typography>
          </Box>
        </Box>
        {data?.files.length ? (
          <Box
            sx={{
              display: 'flex',
              height: '100%',
              overflowY: 'auto',
              flexDirection: 'column',
              gap: '10px',
              marginRight: '-15px',
              paddingRight: '10px',
              overflowX: 'hidden',
            }}
          >
            {data?.files.map(file => (
              <Box
                key={file.sha}
                sx={{
                  backgroundColor: '#dfdfdf',
                  padding: '5px 7px',
                  borderRadius: '7px',
                }}
                onClick={() => handleAdd(file)}
              >
                <Typography sx={{ overflowWrap: 'break-word' }}>
                  {file.filename}
                </Typography>
                <Typography sx={{ overflowX: 'auto' }}>
                  {file.status}
                </Typography>
              </Box>
            ))}
          </Box>
        ) : (
          <Box
            sx={{
              display: 'flex',
              height: '100%',
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Loader />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default CommitModal;

const modalSx = theme => ({
  position: 'absolute',
  zIndex: 999,
  top: '50%',
  left: '50%',
  right: '50%',
  bottom: '50%',
  transform: 'translate(-50%, -50%)',
  width: '100%',
  height: '100%',
  padding: 4,
  [theme.breakpoints.down('xs')]: {
    padding: 1.5,
  },
});
