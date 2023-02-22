import React from 'react';
import {Avatar, Box, Button, Chip, Typography} from "@mui/material";
import theme, {radiusOfComponents} from "../styles/themes.js";
import ClearIcon from '@mui/icons-material/Clear';

const skills = [
    {frame: 'java'},
    {frame: 'piton'},
    {frame: 'java'},
    {frame: 'piton'},
    {frame: 'java'},
    {frame: 'piton'},
    {frame: 'java'},
    {frame: 'piton'}
]

const UserInfo = ({role}) => {


    return (
        <Box sx={wrapper}>
            <Box sx={contentWrapper}>
                <Box sx={{display: 'flex', justifyContent: 'center'}}>
                    <Avatar sx={avatarStyle}/>
                </Box>
                <Box sx={infoStyle}>
                    <Box sx={infoInnerStyle}>
                        <Box sx={infoWrapper}>
                            <span>First Name</span>
                            <Typography>Mihael</Typography>
                        </Box>
                        <Box sx={infoWrapper}>
                            <span>Last name</span>
                            <Typography>Sorokin</Typography>
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
                    <Box sx={infoInnerStyle}>
                        <Box sx={infoWrapper}>
                            <span>Company</span>
                            <Typography>AuditDB network</Typography>
                        </Box>
                        <Box sx={infoWrapper}>
                            <span>E-mail</span>
                            <Typography>Mihael@gmail.com</Typography>
                        </Box>
                        <Box>
                            <Chip
                                sx={{
                                    border: '2px solid #E5E5E5',
                                    borderRadius: '5px',
                                    color: '#434242',
                                    fontWeight: 500
                                }}
                                label={'java'}
                                variant="outlined"
                                onDelete={() => console.log(11)}
                                deleteIcon={<ClearIcon sx={iconSx}/>}
                            />
                            <Chip
                                sx={{
                                    border: '2px solid #E5E5E5',
                                    borderRadius: '5px',
                                    color: '#434242',
                                    fontWeight: 500
                                }}
                                label={'piton'}
                                variant="outlined"
                                onDelete={() => console.log(11)}
                                deleteIcon={<ClearIcon sx={iconSx}/>}
                            />
                            <Chip
                                sx={{
                                    border: '2px solid #E5E5E5',
                                    borderRadius: '5px',
                                    color: '#434242',
                                    fontWeight: 500
                                }}
                                label={'java'}
                                variant="outlined"
                                onDelete={() => console.log(11)}
                                deleteIcon={<ClearIcon sx={iconSx}/>}
                            />
                            <Chip
                                sx={{
                                    border: '2px solid #E5E5E5',
                                    borderRadius: '5px',
                                    color: '#434242',
                                    fontWeight: 500
                                }}
                                label={'react'}
                                variant="outlined"
                                onDelete={() => console.log(11)}
                                deleteIcon={<ClearIcon sx={iconSx}/>}
                            />
                        </Box>
                    </Box>
                </Box>
            </Box>
            <Button
                sx={[buttonSx, role === 'auditor' ? submitAuditor : {}]}
                variant={'contained'}
            >
                Edit
            </Button>
        </Box>
    );
};

export default UserInfo;

const wrapper = (theme) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: '70px',
    [theme.breakpoints.down('md')]: {
        gap: '50px'
    },
    [theme.breakpoints.down('sm')]: {
        gap: '20px',
        padding: '40px 30px'
    },
    [theme.breakpoints.down('xs')]: {
        width: '100%',
        alignItems: 'center',
        gap: '25px'
    }
})

const infoInnerStyle = (theme) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'

})

const infoStyle = (theme) => ({
    display: 'flex',
    margin: '0 0 50px',
    flexDirection: 'row',
    gap: '40px',
    [theme.breakpoints.down('md')]: {
        gap: '10px',
    },
    [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
        gap: '16px',
        margin: 0
    },
})

const iconSx = (theme) => ({
    width: '15px',
    height: '15px',
    '& path': {
        fill: '#52176D'
    }
})

const avatarStyle = (theme) => ({
    width: '205px',
    height: '205px',
    [theme.breakpoints.down('xs')]: {
        width: '150px',
        height: '150px',
    }
})

const contentWrapper = (theme) => ({
    display: 'flex',
    gap: '70px',
    [theme.breakpoints.down('md')]: {
        gap: '50px'
    },
    [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
        gap: '40px'
    }
})

const buttonSx = (theme) => ({
    margin: '0 auto',
    display: 'block',
    color: theme.palette.background.default,
    textTransform: 'capitalize',
    fontWeight: 600,
    fontSize: '18px',
    padding: '9px 50px',
    width: '214px',
    borderRadius: '10px',
    [theme.breakpoints.down('xs')]: {
        width: '88px',
        padding: '9px 10px'
    }
})

const submitAuditor = (theme) => ({
    backgroundColor: theme.palette.secondary.main,
    '&:hover': {
        backgroundColor: '#450e5d'
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
