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
        <Box sx={{paddingX: '10px'}}>
            <Box sx={contentWrapper}>
                <Box sx={{display: 'flex', justifyContent: 'center'}}>
                    <Avatar sx={avatarStyle}/>
                </Box>
                <Box sx={infoStyle}>
                    <Box sx={{display: 'flex', flexDirection: 'column', gap: '28px'}}>
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
                    <Box sx={{display: 'flex', gap: '18px', flexWrap: 'wrap'}}>
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
                                deleteIcon={<ClearIcon sx={iconSx} />}
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
                                deleteIcon={<ClearIcon sx={iconSx} />}
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
                                deleteIcon={<ClearIcon sx={iconSx} />}
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
                                deleteIcon={<ClearIcon sx={iconSx} />}
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

const infoStyle = (theme) => ({
    margin: '68px 0 36px',
    display: 'flex',
    flexDirection: 'column',
    gap: '28px',
    [theme.breakpoints.down('lg')]: {
        margin: '0 0 50px',
        flexDirection: 'row',
        gap: '40px'
    }
})

const iconSx = (theme) => ({
    width: '15px',
    height: '15px',
    '& path': {
        fill: '#52176D'
    }
})

const avatarStyle = (theme) => ({
    width: '270px',
    height: '270px',
    [theme.breakpoints.down('lg')]: {
        width: '205px',
        height: '205px'
    }
})

const contentWrapper = (theme) => ({
    [theme.breakpoints.down('lg')]: {
        display: 'flex',
        gap: '40px'
        // flexDirection: 'column'
    }
})

const buttonSx = (theme) => ({
    margin: '0 auto',
    display: 'block',
    padding: '13px 50px',
    color: theme.palette.background.default,
    borderRadius: radiusOfComponents,
    textTransform: 'capitalize',
    fontSize: '25px',
    fontWeight: 600,
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
    fontSize: '20px',
    color: '#434242',
    '& span': {
        width: '125px',
        marginRight: '75px',
        color: '#B2B3B3',
    }
})
