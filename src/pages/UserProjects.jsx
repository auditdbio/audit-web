import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom/dist';
import { Box, Button, Typography, useMediaQuery } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack.js';
import Layout from '../styles/Layout.jsx';
import Filter from '../components/forms/filter/index.jsx';
import ProjectListCard from '../components/Project-list-card.jsx';
import { PROJECTS } from '../redux/actions/types.js';
import { searchProjects } from '../redux/actions/projectAction.js';
import { clearMessage } from '../redux/actions/auditAction.js';
import CustomPagination from '../components/custom/CustomPagination.jsx';
import { addTestsLabel } from '../lib/helper.js';
import theme from '../styles/themes.js';
import { CustomCard } from '../components/custom/Card.jsx';
import { getProjectsByUserId } from '../redux/actions/projectAction.js';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';

const UserProjects = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const projects = useSelector(state => state.project.userProjects);
  const navigate = useNavigate();

  useEffect(() => {
    if (params.id) {
      dispatch(getProjectsByUserId(params.id));
    }
  }, [params.id]);

  return (
    <Layout>
      <CustomCard sx={wrapper}>
        <Button
          color={'secondary'}
          onClick={() => {
            navigate(
              localStorage.getItem('chat-path')
                ? localStorage.getItem('chat-path')
                : '/',
            );
            localStorage.removeItem('chat-path');
          }}
          sx={{ alignSelf: 'flex-start', justifyContent: 'flex-start' }}
        >
          <ArrowBackRoundedIcon />
        </Button>
        <Box sx={contentWrapper}>
          {projects?.length ? (
            <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
              {projects?.map((project, idx) => (
                <Box
                  sx={[
                    projectListWrapper,
                    idx % 2 === 0 ? borderLeft : {},
                    idx === 0 || idx === 1 ? borderTop : {},
                    idx === 0 ? mobileStyle : {},
                  ]}
                  key={project.id}
                >
                  <ProjectListCard project={project} />
                </Box>
              ))}
            </Box>
          ) : (
            <Typography>Customer has no projects</Typography>
          )}
        </Box>
      </CustomCard>
    </Layout>
  );
};

export default UserProjects;

const wrapper = theme => ({
  padding: '20px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '20px',
  [theme.breakpoints.down('md')]: {
    padding: '20px',
  },
  [theme.breakpoints.down('sm')]: {
    gap: '25px',
    padding: '20px',
    h6: {
      marginTop: '16px',
    },
  },
});

const contentWrapper = theme => ({
  mb: '20px',
  width: '100%',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    flexWrap: 'unset',
  },
});

const borderTop = theme => ({
  borderTop: '1px solid #B2B3B3',
  [theme.breakpoints.down('sm')]: {
    borderTop: 'unset',
  },
});

const borderLeft = {
  borderLeft: '1px solid #B2B3B3',
};

const projectListWrapper = theme => ({
  borderRight: '1px solid #B2B3B3',
  borderBottom: '1px solid #B2B3B3',
  maxHeight: '200px',
  minHeight: '150px',
  overflow: 'hidden',
  width: '50%',
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    borderLeft: '1px solid #B2B3B3',
    height: '160px',
  },
});

const mobileStyle = theme => ({
  [theme.breakpoints.down('sm')]: {
    borderTop: '1px solid #B2B3B3',
  },
});
