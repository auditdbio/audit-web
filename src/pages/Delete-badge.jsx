import React from 'react';
import Layout from '../styles/Layout.jsx';
import { CustomCard } from '../components/custom/Card.jsx';
import { Button, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useDispatch, useSelector } from 'react-redux';
import { deleteBadgeProfile } from '../redux/actions/auditorAction.js';
import { useNavigate } from 'react-router-dom/dist';
import { useParams } from 'react-router-dom';
import CustomSnackbar from '../components/custom/CustomSnackbar.jsx';
import { clearMessage } from '../redux/actions/auditAction.js';

const DeleteBadge = () => {
  const dispatch = useDispatch();
  const { error } = useSelector(s => s.auditor);
  const navigate = useNavigate();
  const { id } = useParams();
  const handleDelete = () => {
    dispatch(deleteBadgeProfile(id));
  };

  return (
    <Layout>
      <CustomSnackbar
        autoHideDuration={5000}
        open={!!error}
        severity={'error'}
        text={error}
        onClose={() => dispatch(clearMessage())}
      />
      <CustomCard sx={cardWrapper}>
        <Typography variant={'h4'}>
          Are you sure you want to delete your account?
        </Typography>
        <Box sx={btnWrapper}>
          <Button
            variant={'contained'}
            color={'secondary'}
            onClick={() => handleDelete()}
          >
            Delete
          </Button>
          <Button
            variant={'contained'}
            onClick={() => navigate('/invite-user')}
          >
            Cancel
          </Button>
        </Box>
      </CustomCard>
    </Layout>
  );
};

export default DeleteBadge;

const cardWrapper = theme => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '30px 40px',
  flexDirection: 'column',
  gap: '80px',
  '& h4': {
    fontWeight: 600,
    textAlign: 'center',
    [theme.breakpoints.down('sm')]: {
      fontSize: '24px',
    },
  },
});

const btnWrapper = theme => ({
  display: 'flex',
  gap: '20px',
  '& button': {
    textTransform: 'unset',
    padding: '10px 25px',
    fontSize: '18px',
  },
});
