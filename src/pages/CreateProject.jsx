import React, { useState } from 'react';
import Layout from '../styles/Layout.jsx';
import { Box } from '@mui/material';
import Projects from '../components/Projects.jsx';
import Audits from '../components/Audits.jsx';
import CreateProjectCard from '../components/CreateProjectCard.jsx';
import { CustomCard } from '../components/custom/Card.jsx';
import Headings from '../router/Headings.jsx';

const CreateProject = () => {
  return (
    <Layout>
      <Headings title="New Project" noIndex={true} />

      <Box sx={wrapper}>
        <CustomCard>
          <CreateProjectCard />
        </CustomCard>
      </Box>
    </Layout>
  );
};

export default CreateProject;

const wrapper = theme => ({
  display: 'flex',
  flexDirection: 'column',
  maxWidth: '1300px',
  width: '100%',
});
