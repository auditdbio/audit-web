import React, { useEffect, useState } from 'react';
import Layout from '../styles/Layout.jsx';
import { CustomCard } from '../components/custom/Card.jsx';
import { Box, Button, Grid, Typography, useMediaQuery } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack.js';
import { useNavigate } from 'react-router-dom/dist';
import { useDispatch, useSelector } from 'react-redux';
import ProjectCard from '../components/Project-card.jsx';
import MyProjectListCard from '../components/My-project-list-card.jsx';
import AuditorModal from '../components/AuditorModal.jsx';
import { useParams, useSearchParams } from 'react-router-dom';
import Loader from '../components/Loader.jsx';
import { createRequest } from '../redux/actions/auditAction.js';
import {
  getAuditors,
  getCurrentAuditor,
} from '../redux/actions/auditorAction.js';
import { addTestsLabel, calcTotalPages } from '../lib/helper.js';
import CustomSnackbar from '../components/custom/CustomSnackbar.jsx';
import CustomPagination from '../components/custom/CustomPagination.jsx';
import theme from '../styles/themes.js';
import { CLEAR_AUDITOR, CUSTOMER } from '../redux/actions/types.js';
import { getMyProject, getProjects } from '../redux/actions/projectAction.js';

const MyProjects = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { myProjects, totalProjects, myProject } = useSelector(
    state => state.project,
  );
  const params = useParams();
  const [isOpenView, setIsOpenView] = useState(false);
  const [query, setQuery] = useState(undefined);
  const [chosen, setChosen] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const auditor = useSelector(state => state?.auditor?.currentAuditor);
  const matchXs = useMediaQuery(theme.breakpoints.down('xs'));
  const [currentPage, setCurrentPage] = useState(
    +searchParams.get('page') || 1,
  );
  const [errorMessage, setErrorMessage] = useState(null);
  //
  useEffect(() => {
    dispatch(getCurrentAuditor(params.id));

    return () => {
      dispatch({ type: CLEAR_AUDITOR });
    };
  }, [params.id]);
  //
  useEffect(() => {
    if (searchParams.get('projectIdToInvite')) {
      dispatch(getMyProject(searchParams.get('projectIdToInvite')));
    }
  }, [searchParams.get('projectIdToInvite')]);

  useEffect(() => {
    if (query && query.page) {
      setSearchParams({
        ...query,
        projectIdToInvite: searchParams.get('projectIdToInvite'),
      });
    }
  }, [query]);

  useEffect(() => {
    dispatch(getProjects(searchParams.get('page')));
  }, [searchParams.get('page')]);
  //
  const handleCloseView = () => {
    setIsOpenView(false);
  };

  useEffect(() => {
    const projects = JSON.parse(localStorage.getItem('project')) || [];
    console.log(projects);
    if (chosen.length > 0) {
      localStorage.setItem(
        'project',
        JSON.stringify(
          chosen,
          projects?.filter(project => project?.id),
        ),
      );
    }
  }, [chosen]);

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
        dispatch(createRequest(data, true, '/profile/projects'));
      });
    }
  };

  useEffect(() => {
    // const chosenProject = searchParams.get('projectIdToInvite');
    // if (chosenProject && chosenProject !== 'null') {
    //   const currentProject = myProjects?.find(
    //     project => project.id === chosenProject,
    //   );
    //   console.log(currentProject);
    //   console.log(
    //     currentProject?.id ===
    //       chosen?.find(el => el.id === searchParams.get('projectIdToInvite')),
    //   );
    if (myProject) {
      setChosen([myProject]);
    }
    return () => localStorage.removeItem('project');
  }, [myProject]);

  useEffect(() => {
    setCurrentPage(+searchParams.get('page') || 1);
  }, [searchParams.toString()]);

  const handleOpenView = () => {
    setChosen(JSON.parse(localStorage.getItem('project')));
    setIsOpenView(true);
  };
  console.log(chosen);
  const handleChangePage = (e, page) => {
    setCurrentPage(page);
    setQuery(prev => {
      const { ...data } = prev || {};
      return { ...data, page };
    });
  };
  // TODO: сделать сохранение выбранного проекта при обновлении
  const totalPages = calcTotalPages(totalProjects || 0);
  console.log(chosen);
  return (
    <Layout>
      <CustomCard sx={wrapper}>
        <CustomSnackbar
          autoHideDuration={3000}
          open={!!errorMessage}
          onClose={() => {
            setErrorMessage(null);
          }}
          severity={'error'}
          text={errorMessage}
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
          <Typography variant={'h6'}>
            Choose project you want to audit
          </Typography>
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
          variant={'contained'}
          sx={submitBtn}
          onClick={handleOpenView}
          disabled={chosen.length === 0 || !auditor}
          {...addTestsLabel('invite-button')}
        >
          Invite to project
        </Button>
        <CustomPagination
          show={totalProjects > 12}
          count={totalPages}
          sx={{ mt: '30px', display: 'flex', justifyContent: 'flex-end' }}
          page={currentPage}
          onChange={handleChangePage}
          showFirstLast={!matchXs}
          size={matchXs ? 'small' : 'medium'}
          color={'primary'}
        />
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
  padding: '48px 74px 80px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '80px',
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
  width: '406px',
  padding: '22px 0',
  fontWeight: 600,
  fontSize: '18px',
  borderRadius: '10px',
  [theme.breakpoints.down('md')]: {
    width: '266px',
    padding: '11px 0',
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
