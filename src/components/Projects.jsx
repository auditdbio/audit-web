import React from 'react';
import {Box, Button, Grid, useMediaQuery} from "@mui/material";
import ProjectCard from "./Project-card.jsx";
import theme, {radiusOfComponents} from "../styles/themes.js";

const Projects = ({role}) => {
    const matchMd = useMediaQuery(theme.breakpoints.down('md'))
    return (
        <Box sx={wrapper}>
            <Box sx={buttonWrapper}>
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
            <Grid container spacing={2} >
                <Grid item sx={gridItemStyle}>
                    <ProjectCard type={role} />
                </Grid>
                <Grid item sx={gridItemStyle}>
                    <ProjectCard type={role} />
                </Grid>
                <Grid item sx={gridItemStyle}>
                    <ProjectCard type={role} />
                </Grid>
                <Grid item sx={gridItemStyle}>
                    <ProjectCard type={role} />
                </Grid>
                <Grid item sx={gridItemStyle}>
                    <ProjectCard type={role} />
                </Grid>
            </Grid>
        </Box>
    );
};

export default Projects;

const buttonWrapper = (theme) => ({
    display: 'flex',
    justifyContent: 'center',
    mb: '46px',
    [theme.breakpoints.down('sm')]: {
        mb: '28px'
    }
})

const wrapper = (theme) => ({
    padding: '58px 52px 42px',
    [theme.breakpoints.down('md')]: {
        padding: '45px 40px 33px'
    },
    [theme.breakpoints.down('sm')]: {
        padding: '36px 25px 45px'
    }
})

const gridItemStyle = (theme) => ({
        width: '25%',
    [theme.breakpoints.down('sm')]: {
        width: '33.330%'
    },
    [theme.breakpoints.down('xs')]: {
        width: '100%'
    }
})

const buttonSx = (theme) => ({
    padding: '9px 35px',
    borderRadius: '10px',
    fontSize: '18px',
    fontWeight: 600,
    lineHeight: '30px',
    textTransform: 'none',
    [theme.breakpoints.down('sm')]: {
        fontSize: '14px',
        width: '161px',
        padding: '11px 25px',
        height: '40px'
    },
})

const buttonAuditorSx = (theme) => ({
    backgroundColor: theme.palette.secondary.main,
    '&:hover': {
        backgroundColor: '#450e5d'
    }
})