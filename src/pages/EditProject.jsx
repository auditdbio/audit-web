import React, { useMemo, useState } from 'react';
import Layout from '../styles/Layout.jsx';
import { Box } from '@mui/material';
import Projects from '../components/Projects.jsx';
import Audits from '../components/Audits.jsx';
import CreateProjectCard from '../components/CreateProjectCard.jsx';
import { CustomCard } from '../components/custom/Card.jsx';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Loader from '../components/Loader.jsx';
import { useSearchParams } from 'react-router-dom/dist';
import Headings from '../router/Headings.jsx';

const EditProject = () => {
  const projectId = useParams();
  const [getSearchParam] = useSearchParams();
  const project = useSelector(s =>
    s.project?.myProjects?.find(p => p.id === projectId.id),
  );
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
          <CustomCard>
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

const tabs = [
  {
    value: 'audits',
    label: 'Audits',
  },
  {
    value: 'projects',
    label: 'Projects',
  },
  {
    value: 'user-info',
    label: 'User info',
  },
];

const wrapper = theme => ({
  display: 'flex',
  flexDirection: 'column',
  maxWidth: '1300px',
  width: '100%',
  height: '100%',
});
