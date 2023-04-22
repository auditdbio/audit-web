import React, {useEffect, useState} from 'react';
import Layout from "../styles/Layout.jsx";
import {CustomCard} from "../components/custom/Card.jsx";
import {Box, Button, Grid, Typography} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack.js";
import {useNavigate} from "react-router-dom/dist";
import {useDispatch, useSelector} from "react-redux";
import ProjectCard from "../components/Project-card.jsx";
import MyProjectListCard from "../components/My-project-list-card.jsx";
import AuditorModal from "../components/AuditorModal.jsx";
import {useParams} from "react-router-dom";
import Loader from "../components/Loader.jsx";
import {createRequest} from "../redux/actions/auditAction.js";

const MyProjects = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const myProjects = useSelector(state => state.project.myProjects)
    const params = useParams()
    const [isOpenView, setIsOpenView] = useState(false);
    const [chosen, setChosen] = useState([])
    const auditor = useSelector(state => state?.auditor?.auditors?.find(auditor => auditor.user_id === params.id))

    const handleCloseView = () => {
        setIsOpenView(false);
    };

    const handleInviteAuditor = (values) => {
        if  (chosen.length > 0){
            chosen.map((project) => {
                const data = {
                    customer_id: values.customer_id,
                    auditor_id: values.auditor_id,
                    price: values.price,
                    description: project.description,
                    time: values.time,
                    // ...project,
                    // ...values,
                    project_id: project.id,
                }
                dispatch(createRequest(data, true, '/profile/projects'))
            })
        }
    };

    useEffect(() => {
        if (localStorage.getItem('project')){
            setChosen([JSON.parse(localStorage.getItem('project'))])
        }
        return () => localStorage.removeItem('project')
    }, [myProjects])

    const handleOpenView = () => {
        localStorage.removeItem('project')
        setIsOpenView(true);
    };

    if  (!auditor) {
        return <Box sx={{
            height: '100vh',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}
        >
            <Loader/>
        </Box>
    } else {
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
                                <MyProjectListCard
                                    setState={setChosen}
                                    state={chosen}
                                    project={project}
                                    isChecked={chosen?.find(el => el?.id === project.id)}
                                />
                            </Grid>
                        ))}
                    </Grid>
                    <Button
                        variant={'contained'}
                        sx={submitBtn}
                        onClick={handleOpenView}
                        disabled={chosen.length === 0}
                    >
                        Invite to project
                    </Button>
                    <AuditorModal
                        open={isOpenView}
                        handleClose={handleCloseView}
                        auditor={auditor}
                        isForm={true}
                        onSubmit={handleInviteAuditor}
                    />
                </CustomCard>
            </Layout>
        );
    }
};

export default MyProjects;

const gridItemStyle = (theme) => ({
    width: "25%",
    [theme.breakpoints.down("sm")]: {
        width: "33.330%",
    },
    [theme.breakpoints.down("xs")]: {
        width: "50%",
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
        gap: '25px',
        padding: '38px 20px 30px',
        'h6': {
            marginTop: '16px'
        }
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