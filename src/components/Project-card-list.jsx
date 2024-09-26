import React from 'react';
import { Grid } from '@mui/material';
import ProjectCard from './Project-card.jsx';

const ProjectCardList = ({ projects, role, isPublic }) => {
  return (
    <Grid container spacing={2}>
      {projects?.map(project => (
        <Grid key={project.id} item sx={gridItemStyle}>
          <ProjectCard
            project={project}
            isPublic={isPublic}
            type={role}
            currentRole={role}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default ProjectCardList;

const gridItemStyle = theme => ({
  width: '25%',
  [theme.breakpoints.down('sm')]: {
    width: '33.330%',
  },
  [theme.breakpoints.down('xs')]: {
    width: '100%',
  },
});
