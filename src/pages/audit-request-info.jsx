import React from 'react';
import {CustomCard} from "../components/custom/Card.jsx";
import Layout from "../styles/Layout.jsx";
import {Avatar, Box, Button, Typography, Link, useMediaQuery} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack.js";
import GitHubIcon from '@mui/icons-material/GitHub';
import theme from "../styles/themes.js";
import {useNavigate} from "react-router-dom/dist";

const AuditRequestInfo = () => {
    const navigate = useNavigate()
    const matchXs = useMediaQuery(theme.breakpoints.down('xs'))

    return (
        <Layout>
            <CustomCard sx={wrapper}>
                <Box sx={{display: 'flex', width: '100%', position: 'relative'}}>
                    <Button sx={backButtonSx} onClick={() => navigate('/home-auditor')}>
                        <ArrowBackIcon color={'secondary'}/>
                    </Button>
                    <Typography variant={'h3'} sx={{width: '100%', textAlign: 'center'}}>
                        AuditBD
                    </Typography>
                </Box>
                <Box>
                    <Box sx={contentWrapper}>
                        <Typography sx={titleSx}>Criptography,  Games</Typography>
                        <Box sx={salaryWrapper}>
                            <Box sx={{display: 'flex', alignItems: 'center', gap: '15px'}}>
                                <svg width="27" height="26" viewBox="0 0 27 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M13.6131 0.249512C11.1111 0.249512 8.66532 0.991432 6.58501 2.38145C4.5047 3.77147 2.8833 5.74716 1.92583 8.05868C0.968372 10.3702 0.717856 12.9137 1.20597 15.3676C1.69408 17.8215 2.89889 20.0756 4.66805 21.8447C6.43721 23.6139 8.69125 24.8187 11.1451 25.3068C13.599 25.7949 16.1426 25.5444 18.4541 24.5869C20.7656 23.6295 22.7413 22.0081 24.1313 19.9278C25.5213 17.8474 26.2633 15.4017 26.2633 12.8997C26.2568 9.54663 24.922 6.33274 22.551 3.96177C20.18 1.59079 16.9661 0.255941 13.6131 0.249512ZM15.0727 18.7382H14.5862V19.7113C14.5862 19.9694 14.4836 20.2169 14.3012 20.3994C14.1187 20.5819 13.8712 20.6844 13.6131 20.6844C13.355 20.6844 13.1075 20.5819 12.925 20.3994C12.7425 20.2169 12.64 19.9694 12.64 19.7113V18.7382H10.6938C10.4357 18.7382 10.1882 18.6357 10.0057 18.4532C9.82324 18.2707 9.72071 18.0232 9.72071 17.7651C9.72071 17.5071 9.82324 17.2596 10.0057 17.0771C10.1882 16.8946 10.4357 16.7921 10.6938 16.7921H15.0727C15.4598 16.7921 15.8311 16.6383 16.1048 16.3645C16.3786 16.0908 16.5323 15.7195 16.5323 15.3324C16.5323 14.9453 16.3786 14.574 16.1048 14.3003C15.8311 14.0266 15.4598 13.8728 15.0727 13.8728H12.1534C11.2502 13.8728 10.3839 13.514 9.74516 12.8752C9.10645 12.2365 8.74762 11.3702 8.74762 10.467C8.74762 9.56369 9.10645 8.6974 9.74516 8.05869C10.3839 7.41997 11.2502 7.06115 12.1534 7.06115H12.64V6.08806C12.64 5.82998 12.7425 5.58247 12.925 5.39998C13.1075 5.21749 13.355 5.11497 13.6131 5.11497C13.8712 5.11497 14.1187 5.21749 14.3012 5.39998C14.4836 5.58247 14.5862 5.82998 14.5862 6.08806V7.06115H16.5323C16.7904 7.06115 17.0379 7.16367 17.2204 7.34616C17.4029 7.52865 17.5054 7.77616 17.5054 8.03424C17.5054 8.29232 17.4029 8.53983 17.2204 8.72232C17.0379 8.90481 16.7904 9.00733 16.5323 9.00733H12.1534C11.7663 9.00733 11.3951 9.16111 11.1213 9.43485C10.8476 9.70858 10.6938 10.0798 10.6938 10.467C10.6938 10.8541 10.8476 11.2253 11.1213 11.4991C11.3951 11.7728 11.7663 11.9266 12.1534 11.9266H15.0727C15.976 11.9266 16.8423 12.2854 17.481 12.9241C18.1197 13.5629 18.4785 14.4291 18.4785 15.3324C18.4785 16.2357 18.1197 17.102 17.481 17.7407C16.8423 18.3794 15.976 18.7382 15.0727 18.7382Z" fill="#FF9900"/>
                                </svg>
                                3.1 K
                            </Box>
                            <Box sx={{display: 'flex', alignItems: 'center', gap: '15px'}}>
                                <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M13.2559 25.5499C20.2424 25.5499 25.9061 19.8862 25.9061 12.8997C25.9061 5.91319 20.2424 0.249512 13.2559 0.249512C6.26939 0.249512 0.605713 5.91319 0.605713 12.8997C0.605713 19.8862 6.26939 25.5499 13.2559 25.5499Z" fill="#52176D"/>
                                    <path d="M13.257 4.64941L15.4702 9.71865L20.4071 10.5528L16.8321 14.4671L17.6833 20.0496L13.257 17.4188L8.83078 20.0496L9.68199 14.4671L6.10693 10.5528L11.0439 9.71865L13.257 4.64941Z" fill="#FFCA28"/>
                                </svg>
                                150
                            </Box>
                        </Box>
                        { !matchXs &&
                            <Box sx={{display: 'flex', gap: '25px'}}>
                                <Typography variant={'caption'}>Mihael@gmail.com</Typography>
                                <Typography variant={'caption'}>Mihael@</Typography>
                            </Box>
                        }
                    </Box>
                    <Box sx={infoWrapper}>
                        <Typography variant={'h4'}>Main text</Typography>
                        <Typography sx={descriptionSx}>
                            Text text text text text text text tex ttext text text text text text text tex ttexttext text text text text text tex ttext text text text text text text tex ttext
                        </Typography>
                        { matchXs &&
                            <Box sx={{display: 'flex', gap: '25px'}}>
                                <Typography variant={'caption'}>Mihael@gmail.com</Typography>
                                <Typography variant={'caption'}>Mihael@</Typography>
                            </Box>
                        }
                        <Box sx={linkWrapper}>
                            <Typography>
                                <GitHubIcon/>
                                <Link>www.github.com/fgghhhfj/mjjhddfdf...</Link>
                            </Typography>
                            <Typography>
                                <GitHubIcon/>
                                <Link>www.github.com/fgghhhfj/mjjhddfdf...</Link>
                            </Typography>
                            <Typography>
                                <GitHubIcon/>
                                <Link>www.github.com/fgghhhfj/mjjhddfdf...</Link>
                            </Typography>
                            <Typography>
                                <GitHubIcon/>
                                <Link>www.github.com/fgghhhfj/mjjhddfdf...</Link>
                            </Typography>
                        </Box>
                    </Box>
                </Box>
                <Box sx={buttonWrapper}>
                    <Button
                        variant={'contained'}
                        sx={[buttonSx, {backgroundColor: theme.palette.secondary.main}]}
                    >
                        Decline
                    </Button>
                    <Button
                        variant={'contained'}
                        sx={buttonSx}
                    >
                        Make offer
                    </Button>
                </Box>
            </CustomCard>
        </Layout>
    );
};

export default AuditRequestInfo;

const wrapper = (theme) => ({
    padding: '48px 74px 80px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
    '& h3': {
      fontSize: '37px',
        fontWeight: 500,
    },
    [theme.breakpoints.down('md')]: {
        padding: '38px 44px 60px',
        '& h3': {
            fontSize: '30px',
        },
    },
    [theme.breakpoints.down('sm')]: {
        gap: '20px',
        padding: '38px 20px 30px',
    },
})

const buttonWrapper = (theme) => ({
    marginTop: '40px'
})

const descriptionSx = (theme) => ({
    fontSize: '16px!important',
    fontWeight: 500,
    [theme.breakpoints.down('sm')]: {
        marginBottom: '25px'
    }
})

const contentWrapper = (theme) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
    '& span': {
        fontSize: '18px',
        fontWeight: 500
    }
})

const titleSx = (theme) => ({
    fontWeight: 500,
    [theme.breakpoints.down('md')]: {
        fontSize: '20px'
    }
})

const salaryWrapper = (theme) => ({
    display: 'flex',
    gap: '50px',
    fontSize: '26px',
    fontWeight: 500,
    [theme.breakpoints.down('sm')]: {
        fontSize: '20px'
    }
})

const infoWrapper = (theme) => ({
    marginTop: '30px',
    '& h4': {
        fontWeight: 600,
        fontSize: '24px',
        marginBottom: '40px',
        textAlign: 'center'
    },
    [theme.breakpoints.down('sm')]: {
        '& span': {
            fontSize: '15px',
            fontWeight: 500
        }
    },
    [theme.breakpoints.down('xs')]: {
        width: '310px',
        '& h4': {
            textAlign: 'start',
        },
    }
})

const linkWrapper = (theme) => ({
    display: 'flex',
    flexWrap: 'wrap',
    columnGap: '80px',
    marginTop: '50px',
    justifyContent: 'space-around',
    '& p': {
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        fontSize: '18px',
        '& a': {
            color: '#152BEA',
        }
    },
    [theme.breakpoints.down('sm')]: {
        columnGap: '40px',
        marginTop: '25px',
        '& p': {
            fontSize: '15px',
        }
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
        width: '140px',
        margin: '0 6px',
    }
})