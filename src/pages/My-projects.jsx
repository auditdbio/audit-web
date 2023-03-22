import React from 'react';
import Layout from "../styles/Layout.jsx";
import {CustomCard} from "../components/custom/Card.jsx";
import {Box, Button, Grid, Typography} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack.js";
import {useNavigate} from "react-router-dom/dist";
import {useSelector} from "react-redux";
import ProjectCard from "../components/Project-card.jsx";
import MyProjectListCard from "../components/My-project-list-card.jsx";

const MyProjects = () => {
    const navigate = useNavigate()
    const myProjects = useSelector(state => state.project.myProjects)

    return (
        <Layout>
            <CustomCard sx={wrapper}>
                <Box sx={{display: 'flex', justifyContent: 'center', width: '100%', position: 'relative'}}>
                    <Button sx={backButtonSx} onClick={() => navigate(-1)}>
                        <ArrowBackIcon/>
                    </Button>
                    <Typography variant={'h6'}>Choose project you want to audit</Typography>
                </Box>
                <Grid container spacing={2}>
                    {myProjects?.map((project) => (
                        <Grid key={project.id} item sx={gridItemStyle}>
                            <MyProjectListCard project={project} />
                        </Grid>
                    ))}
                </Grid>
                <Button variant={'contained'} sx={submitBtn}>Invite to project</Button>
            </CustomCard>
        </Layout>
    );
};

export default MyProjects;

const gridItemStyle = (theme) => ({
    width: "25%",
    [theme.breakpoints.down("sm")]: {
        width: "33.330%",
    },
    [theme.breakpoints.down("xs")]: {
        width: "100%",
    },
});

const wrapper = (theme) => ({
    padding: '48px 74px 80px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '80px',
    [theme.breakpoints.down('md')]: {
        padding: '38px 44px 60px',
    },
    [theme.breakpoints.down('sm')]: {
        gap: '40px',
        padding: '38px 20px 30px',
    },
})

const submitBtn = (theme) => ({
    textTransform: 'none',
    margin: 'auto 0 0',
    width: '406px',
    padding: '22px 0',
    fontSize: '18px',
    borderRadius: '10px',
    [theme.breakpoints.down('md')]: {
        width: '266px',
        padding: '11px 0',
        fontSize: '14px',
    },
    [theme.breakpoints.down('xs')]: {
        width: '178px',
    }
})

const backButtonSx = (theme) => ({
    position: 'absolute',
    left: '-30px',
    top: 0,
    [theme.breakpoints.down('sm')]: {
        top: '-30px'
    }
})