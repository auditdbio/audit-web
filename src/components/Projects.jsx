import React from 'react';
import {Box, Button} from "@mui/material";
import ProjectCard from "./Project-card.jsx";
import theme, {radiusOfComponents} from "../styles/themes.js";

const Projects = () => {
    return (
        <Box>
            <Box sx={{display: 'flex', justifyContent: 'center', mb: '46px'}}>
                <Button sx={buttonSx} variant={'contained'}>+ New project</Button>
            </Box>
            <Box sx={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between'}}>
                <ProjectCard />
                <ProjectCard />
                <ProjectCard />
                <ProjectCard />
                <ProjectCard />
                {/*<ProjectCard />*/}
            </Box>
        </Box>
    );
};

export default Projects;

const buttonSx = (theme) => ({
    padding: '20px 34px',
    borderRadius: radiusOfComponents,
    fontSize: '25px',
    fontWeight: 600,
    lineHeight: '30px',
})