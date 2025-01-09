import React, { useEffect, useMemo } from 'react';
import Layout from '../styles/Layout.jsx';
import { Box } from '@mui/material';
import CreateProjectCard from '../components/CreateProjectCard.jsx';
import { CustomCard } from '../components/custom/Card.jsx';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader.jsx';
import { useSearchParams } from 'react-router-dom/dist';
import Headings from '../router/Headings.jsx';
import { getMyProjectById } from '../redux/actions/projectAction.js';
import { CLEAR_NOT_FOUND, CLEAR_PROJECT } from '../redux/actions/types.js';

const EditProject = () => {
  const projectId = useParams();
  const dispatch = useDispatch();
  const [getSearchParam] = useSearchParams();
  const project = useSelector(s => s.project?.currentProject);
  useEffect(() => {
    dispatch(getMyProjectById(projectId.id));
    return () => {
      dispatch({ type: CLEAR_NOT_FOUND });
      dispatch({ type: CLEAR_PROJECT });
    };
  }, []);
  const myProject = useMemo(() => {
    if (!!getSearchParam.get('copy')) {
      return { ...project, id: null, status: '' };
    } else {
      return project;
    }
  }, [project, getSearchParam]);

  return (
    <Layout>
      <Box sx={wrapper}>
        {!project ? (
          <Box
            sx={{
              height: '100%',
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Headings title="Edit Project" noIndex={true} />
            <Loader />
          </Box>
        ) : (
          <CustomCard sx={cardSx}>
            <Headings
              title={`${myProject?.name || ''} | Edit Project`}
              noIndex={true}
            />
            <CreateProjectCard projectInfo={myProject} />
          </CustomCard>
        )}
      </Box>
    </Layout>
  );
};

export default EditProject;

const cardSx = theme => ({
  [theme.breakpoints.down('xs')]: {
    borderRadius: 'unset',
  },
});

const wrapper = theme => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: '100%',
});
