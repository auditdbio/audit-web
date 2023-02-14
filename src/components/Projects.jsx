import React from 'react';
import {Box, Button} from "@mui/material";
import ProjectCard from "./Project-card.jsx";
import {radiusOfComponents} from "../styles/themes.js";

const Projects = ({role}) => {
    return (
        <Box>
            <Box sx={{display: 'flex', justifyContent: 'center', mb: '46px'}}>
                <Button
                    sx={[buttonSx, role === 'auditor' ? buttonAuditorSx : {}]}
                    variant={'contained'}
                >
                    {role === 'auditor' ?
                        '+ New audit'
                        :
                        '+ New project'
                    }

                </Button>
            </Box>
            <Box sx={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between'}}>
                <ProjectCard type={role} />
                <ProjectCard type={role} />
                <ProjectCard type={role} />
                <ProjectCard type={role} />
                <ProjectCard type={role} />
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
    textTransform: 'none'
})

const buttonAuditorSx = (theme) => ({
    backgroundColor: theme.palette.secondary.main,
    '&:hover': {
        backgroundColor: '#450e5d'
    }
})