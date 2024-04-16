import React, { useEffect, useState } from 'react';
import Layout from '../styles/Layout.jsx';
import { CustomCard } from '../components/custom/Card.jsx';
import { Box, Button, Grid, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack.js';
import { useNavigate } from 'react-router-dom/dist';
import { useDispatch, useSelector } from 'react-redux';
import MyProjectListCard from '../components/My-project-list-card.jsx';
import AuditorModal from '../components/AuditorModal.jsx';
import { useParams, useSearchParams } from 'react-router-dom';
import { clearMessage, createRequest } from '../redux/actions/auditAction.js';
import { getAuditorById } from '../redux/actions/auditorAction.js';
import { addTestsLabel } from '../lib/helper.js';
import CustomSnackbar from '../components/custom/CustomSnackbar.jsx';
import { CLEAR_MESSAGES } from '../redux/actions/types.js';

const MyProjects = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const myProjects = useSelector(state => state.project.myProjects);
  const params = useParams();
  const successMessage = useSelector(s => s.audits.successMessage);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isOpenView, setIsOpenView] = useState(false);
  const [chosen, setChosen] = useState([]);
  const auditor = useSelector(state => state?.auditor?.currentAuditor);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    // if (!auditor) {
    dispatch(getAuditorById(params.id));
    // }
    return () => {
      localStorage.removeItem('chat-path');
    };
  }, [params.id]);

  const handleCloseView = () => {
    setIsOpenView(false);
  };

  const handleInviteAuditor = values => {
    if (chosen.length > 0) {
      chosen.map(project => {
        const data = {
          customer_id: values?.customer_id,
          auditor_id: values?.auditor_id,
          price: values?.price,
          description: project?.description,
          time: values?.time,
          project_id: project?.id,
        };
        dispatch(
          createRequest(
            data,
            true,
            '/profile/projects',
            !!localStorage.getItem('chat-path'),
          ),
        );
      });
      if (localStorage.getItem('chat-path')) {
        navigate(localStorage.getItem('chat-path'));
      }
    }
  };

  useEffect(() => {
    const chosenProject = searchParams.get('projectIdToInvite');
    if (chosenProject && chosenProject !== 'null') {
      const currentProject = myProjects?.find(
        project => project.id === chosenProject,
      );
      setChosen([currentProject]);
    }
    return () => localStorage.removeItem('project');
  }, [myProjects]);

  const handleOpenView = () => {
    localStorage.removeItem('project');
    setIsOpenView(true);
  };

  return (
    <Layout>
      <CustomCard sx={wrapper}>
        <CustomSnackbar
          autoHideDuration={3000}
          open={!!errorMessage}
          onClose={() => {
            setErrorMessage(null);
          }}
          severity="error"
          text={errorMessage}
        />
        <CustomSnackbar
          autoHideDuration={3000}
          open={!!successMessage}
          onClose={() => {
            dispatch(clearMessage());
          }}
          severity="success"
          text={successMessage}
        />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
            position: 'relative',
          }}
        >
          <Button
            sx={backButtonSx}
            onClick={() => navigate(-1)}
            {...addTestsLabel('go-back-button')}
          >
            <ArrowBackIcon />
          </Button>
          <Typography variant="h6">Choose project you want to audit</Typography>
        </Box>
        <Grid container spacing={2}>
          {myProjects?.map(project => (
            <Grid key={project.id} item sx={gridItemStyle}>
              <MyProjectListCard
                setState={setChosen}
                state={chosen}
                project={project}
                isChecked={chosen?.find(el => el?.id === project.id)}
              />
            </Grid>
          ))}
        </Grid>
        <Button
          variant="contained"
          sx={submitBtn}
          onClick={handleOpenView}
          disabled={chosen.length === 0 || !auditor}
          {...addTestsLabel('invite-button')}
        >
          Invite to project
        </Button>
        {auditor && (
          <AuditorModal
            open={isOpenView}
            handleClose={handleCloseView}
            auditor={auditor}
            isForm={true}
            onSubmit={handleInviteAuditor}
            setError={setErrorMessage}
          />
        )}
      </CustomCard>
    </Layout>
  );
};

export default MyProjects;

const gridItemStyle = theme => ({
  width: '25%',
  [theme.breakpoints.down('sm')]: {
    width: '33.330%',
  },
  [theme.breakpoints.down('xs')]: {
    width: '50%',
  },
});

const wrapper = theme => ({
  padding: '40px 74px 80px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '40px',
  [theme.breakpoints.down('md')]: {
    padding: '38px 44px 60px',
  },
  [theme.breakpoints.down('sm')]: {
    gap: '25px',
    padding: '38px 20px 30px',
    h6: {
      marginTop: '16px',
    },
  },
});

const submitBtn = theme => ({
  textTransform: 'none',
  margin: 'auto 0 0',
  width: '350px',
  padding: '10px 0',
  fontWeight: 600,
  fontSize: '16px',
  borderRadius: '10px',
  [theme.breakpoints.down('md')]: {
    width: '250px',
    fontSize: '14px',
  },
  [theme.breakpoints.down('xs')]: {
    width: '178px',
  },
});

const backButtonSx = theme => ({
  position: 'absolute',
  left: '-30px',
  top: 0,
  [theme.breakpoints.down('sm')]: {
    top: '-30px',
  },
});
