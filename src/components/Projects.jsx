import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom/dist';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button } from '@mui/material';
import { getProjects } from '../redux/actions/projectAction.js';
import { AUDITOR, CUSTOMER, DONE } from '../redux/actions/types.js';
import Loader from './Loader.jsx';
import CustomSnackbar from './custom/CustomSnackbar.jsx';
import { addTestsLabel } from '../lib/helper.js';
import ProjectCardList from './Project-card-list.jsx';
import Headings from '../router/Headings.jsx';

const Projects = ({ role }) => {
  const navigate = useNavigate();
  const projects = useSelector(state => state.audits.audits);
  const myProjects = useSelector(state => state.project.myProjects);
  const customer = useSelector(state => state.customer.customer);
  const dispatch = useDispatch();
  const [error, setError] = useState(null);
  const projectReducer = useMemo(() => {
    if (role === AUDITOR) {
      return projects;
    } else {
      return (
        myProjects &&
        [...myProjects].sort(project => (project.status === DONE ? 1 : -1))
      );
    }
  }, [role, projects, myProjects]);

  useEffect(() => {
    dispatch(getProjects());
  }, []);

  const handleNavigate = () => {
    if (role === CUSTOMER) {
      if (customer.user_id || customer.first_name || customer.last_name) {
        navigate('/create-project');
      } else {
        setError('Fill in your profile first');
      }
    } else {
      navigate('/projects');
    }
  };

  if (!projectReducer) {
    return <Loader role={role} />;
  } else {
    return (
      <Box sx={wrapper}>
        <Headings title={role === CUSTOMER ? 'My Projects' : 'My Audits'} />

        <Box sx={buttonWrapper}>
          <Button
            sx={[buttonSx, role === 'auditor' ? buttonAuditorSx : {}]}
            variant="contained"
            onClick={handleNavigate}
            {...addTestsLabel('add-new-button')}
          >
            {role === 'auditor' ? '+ New audit' : '+ New project'}
          </Button>
        </Box>

        <CustomSnackbar
          autoHideDuration={5000}
          open={!!error}
          onClose={() => setError(null)}
          severity="warning"
          text={error}
        />

        <ProjectCardList projects={projectReducer} role={role} />
      </Box>
    );
  }
};

export default Projects;

const buttonWrapper = theme => ({
  display: 'flex',
  justifyContent: 'center',
  mb: '30px',
  [theme.breakpoints.down('sm')]: {
    mb: '20px',
  },
});

const wrapper = theme => ({
  padding: '20px 40px 40px',
  width: '100%',
  alignSelf: 'baseline',
  [theme.breakpoints.down('md')]: {
    padding: '20px 25px 40px',
  },
  [theme.breakpoints.down('xxs')]: {
    padding: '20px 10px 40px',
  },
});

const gridItemStyle = theme => ({
  width: '25%',
  [theme.breakpoints.down('sm')]: {
    width: '33.330%',
  },
  [theme.breakpoints.down('xs')]: {
    width: '100%',
  },
});

const buttonSx = theme => ({
  padding: '9px 35px',
  borderRadius: '10px',
  fontSize: '16px',
  fontWeight: 600,
  lineHeight: '30px',
  textTransform: 'none',
  [theme.breakpoints.down('sm')]: {
    fontSize: '14px',
    width: '161px',
    padding: '11px 25px',
    height: '40px',
  },
  [theme.breakpoints.down('xs')]: {
    width: '140px',
    fontSize: '12px',
  },
});

const buttonAuditorSx = theme => ({
  backgroundColor: theme.palette.secondary.main,
  '&:hover': {
    backgroundColor: '#450e5d',
  },
});
