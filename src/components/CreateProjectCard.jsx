import React from 'react';
import {Avatar, Box, Button, Chip, Typography} from "@mui/material";
import theme, {radiusOfComponents} from "../styles/themes.js";
import ClearIcon from '@mui/icons-material/Clear';
import {useNavigate} from "react-router-dom/dist";
import TagsArray from "./tagsArray/index.jsx";

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

const CreateProjectCard = ({role}) => {
    const navigate = useNavigate()

    const handleEdit = () => {
        navigate('/edit-profile')
    }

    return (
        <Box sx={wrapper}>

        </Box>
    );
};

export default CreateProjectCard;

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
