import React, { useEffect } from 'react';
import Layout from '../styles/Layout.jsx';
import { Box } from '@mui/material';
import CreateProjectCard from '../components/CreateProjectCard.jsx';
import { CustomCard } from '../components/custom/Card.jsx';
import Headings from '../router/Headings.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { CLEAR_PROJECT } from '../redux/actions/types.js';

const CreateProject = () => {
  const dispatch = useDispatch();
  const project = useSelector(s => s.project?.currentProject);
  useEffect(() => {
    return () => {
      if (!!project?.id) {
        dispatch({ type: CLEAR_PROJECT });
      }
    };
  }, []);
  return (
    <Layout>
      <Headings title="New Project" noIndex={true} />

      <Box sx={wrapper}>
        <CustomCard sx={cardSx}>
          <CreateProjectCard />
        </CustomCard>
      </Box>
    </Layout>
  );
};

export default CreateProject;

const cardSx = theme => ({
  [theme.breakpoints.down('xs')]: {
    borderRadius: 'unset',
  },
});

const wrapper = theme => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
});
