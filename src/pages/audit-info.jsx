import React from 'react';
import {CustomCard} from "../components/custom/Card.jsx";
import Layout from "../styles/Layout.jsx";
import {Avatar, Box, Button, Typography} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {CustomButton} from "../components/custom/Button.jsx";
import TagsArray from "../components/tagsArray/index.jsx";
import theme from "../styles/themes.js";
import {useNavigate} from "react-router-dom/dist";

const AuditInfo = () => {
    const navigate = useNavigate()

    return (
        <Layout>
            <CustomCard sx={wrapper}>
                <Box sx={{display: 'flex', width: '100%', position: 'relative'}}>
                   <Button sx={backButtonSx} onClick={() => navigate('/home-customer')}>
                       <ArrowBackIcon/>
                   </Button>
                    <Typography sx={{width: '100%', textAlign: 'center'}}>
                        You have offer to audit for AuditDB project!
                    </Typography>
                </Box>
                <Box sx={contentWrapper}>
                    <Box sx={userWrapper}>
                        <Avatar/>
                        <Box>
                            <Typography>
                                Mihael Sorokin
                            </Typography>
                            <Typography>
                                AuditDB network
                            </Typography>
                        </Box>
                    </Box>
                    <Box sx={userInfoWrapper}>
                        <Box sx={infoWrapper}>
                            <span>E-mail</span>
                            <Typography>Mihael@gmail.com</Typography>
                        </Box>
                        <Box sx={infoWrapper}>
                            <span>Telegram</span>
                            <Typography>Mihael@</Typography>
                        </Box>
                        <Box sx={infoWrapper}>
                            <span>Tax rate</span>
                            <Typography>20 $ per stroke</Typography>
                        </Box>
                    </Box>
                    <Box sx={projectWrapper}>
                        <Typography>Time for project</Typography>
                        <Box sx={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                            <Box sx={dateWrapper}>10.01.2023</Box>
                            -
                            <Box sx={dateWrapper}>25.01.2023</Box>
                        </Box>
                        <TagsArray/>
                    </Box>
                </Box>
                <Box>
                    <Button
                        variant={'contained'}
                        sx={buttonSx}
                    >
                        Confirm
                    </Button>
                    <Button
                        variant={'contained'}
                        sx={[buttonSx, {backgroundColor: theme.palette.secondary.main}]}
                    >
                        Decline
                    </Button>
                </Box>
            </CustomCard>
        </Layout>
    );
};

export default AuditInfo;

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

const backButtonSx = (theme) => ({
    position: 'absolute',
    left: '-30px',
    top: 0,
    [theme.breakpoints.down('sm')]: {
        top: '-30px'
    }
})

const contentWrapper = (theme) => ({
    display: 'flex',
    gap: '100px',
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
        gap: '60px'
    },
    [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
        alignItems: 'baseline',
        gap: '16px'
    }
})

const userWrapper = (theme) => ({
    '& .MuiAvatar-root': {
        width: '120px',
        height: '120px'
    },
    '& p': {
        color: '#434242',
        fontSize: '15px',
        fontWeight: 500,
        '&:nth-of-type(1)': {
            margin: '34px 0 18px'
        }
    },
    [theme.breakpoints.down('md')]: {
        '& .MuiAvatar-root': {
            width: '90px',
            height: '90px'
        },
    },
    [theme.breakpoints.down('sm')]: {
        display: 'flex',
        gap: '20px',
        alignItems: 'center',
        marginBottom: '20px',
        '& p': {
            color: '#434242',
            fontSize: '15px',
            fontWeight: 500,
            '&:nth-of-type(1)': {
                margin: '0 0 18px'
            }
        },
    }
})

const userInfoWrapper = (theme) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
    [theme.breakpoints.down('sm')]: {
        gap: '16px'
    }
})

const buttonSx = (theme) => ({
    padding: '19px 0',
    fontSize: '18px',
    textTransform: 'unset',
    fontWeight: 600,
    margin: '0 12px',
    width: '270px',
    borderRadius: '10px',
    [theme.breakpoints.down('md')]: {
        width: '210px',
        padding: '11px 0'
    },
    [theme.breakpoints.down('sm')]: {
        width: '170px'
    },
    [theme.breakpoints.down('xs')]: {
        width: '140px'
    }
})

const dateWrapper = (theme) => ({
    border: '1.5px solid #E5E5E5',
    width: '120px',
    padding: '18px 0',
    textAlign: 'center',
    [theme.breakpoints.down('md')]: {
        width: '90px'
    }
})

const projectWrapper = (theme) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: '25px',
    '& p': {
        color: '#B2B3B3',
        fontSize: '15px',
        fontWeight: 500
    },
    [theme.breakpoints.down('sm')]: {
        gap: '16px'
    }
})

const infoWrapper = (theme) => ({
    display: 'flex',
    fontWeight: 500,
    color: '#434242',
    '& p': {
        fontSize: 'inherit'
    },
    '& span': {
        width: '125px',
        marginRight: '50px',
        color: '#B2B3B3',
    },
    fontSize: '15px',
    [theme.breakpoints.down('md')]: {
        '& span': {
            width: '90px',
            marginRight: '20px'
        }
    },
    [theme.breakpoints.down('xs')]: {
        fontSize: '12px'
    }
})