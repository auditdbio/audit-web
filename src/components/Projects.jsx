import React from 'react';
import {Box, Button, Grid, useMediaQuery} from "@mui/material";
import ProjectCard from "./Project-card.jsx";
import theme, {radiusOfComponents} from "../styles/themes.js";

const Projects = ({role}) => {
    const matchMd = useMediaQuery(theme.breakpoints.down('md'))
    return (
        <Box sx={wrapper}>
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
            <Grid container spacing={3}>
                <Grid item xs={6} md={3} sm={4}>
                    <ProjectCard type={role} />
                </Grid>
                <Grid item xs={6} md={3} sm={4}>
                    <ProjectCard type={role} />
                </Grid>
                <Grid item xs={6} md={3} sm={4}>
                    <ProjectCard type={role} />
                </Grid>
                <Grid item xs={6} md={3} sm={4}>
                    <ProjectCard type={role} />
                </Grid>
                <Grid item xs={6} md={3} sm={4}>
                    <ProjectCard type={role} />
                </Grid>
            </Grid>
        </Box>
    );
};

export default Projects;

const wrapper = (theme) => ({
    padding: '58px 52px 42px',
    [theme.breakpoints.down('md')]: {
        padding: '45px 40px 33px'
    }
})

const buttonSx = (theme) => ({
    padding: '9px 35px',
    borderRadius: '10px',
    fontSize: '18px',
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