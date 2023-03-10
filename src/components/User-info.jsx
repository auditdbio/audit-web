import React, {useEffect, useMemo} from 'react';
import {Avatar, Box, Button, Chip, Typography} from "@mui/material";
import theme, {radiusOfComponents} from "../styles/themes.js";
import ClearIcon from '@mui/icons-material/Clear';
import {useNavigate} from "react-router-dom/dist";
import TagsArray from "./tagsArray/index.jsx";
import {useDispatch, useSelector} from "react-redux";
import {getAuditor} from "../redux/actions/auditorAction.js";
import {getCustomer} from "../redux/actions/customerAction.js";
import Loader from "./Loader.jsx";
import {AUDITOR} from "../redux/actions/types.js";
import TagsList from "./tagsList";

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
    const navigate = useNavigate()
    const customer = useSelector(s => s.customer.customer)
    const auditor = useSelector(s => s.auditor.auditor)

    const handleEdit = () => {
        navigate('/edit-profile')
    }

    const data = useMemo(() => {
        if (role === AUDITOR){
            return auditor
        } else {
            return customer
        }
    },[role, customer, auditor])

    if (!data){
        return <Loader role={role}/>
    } else {
        return (
            <Box sx={wrapper}>
                <Box sx={contentWrapper}>
                    <Box sx={{display: 'flex', justifyContent: 'center'}}>
                        <Avatar src={data.avatar} sx={avatarStyle}/>
                    </Box>
                    <Box sx={infoStyle}>
                        <Box sx={infoInnerStyle}>
                            <Box sx={infoWrapper}>
                                <span>First Name</span>
                                <Typography noWrap={true}>{data.first_name}</Typography>
                            </Box>
                            <Box sx={infoWrapper}>
                                <span>Last name</span>
                                <Typography noWrap={true}>{data.last_name}</Typography>
                            </Box>
                            <Box sx={infoWrapper}>
                                <span>Telegram</span>
                                <Typography noWrap={true}>{data.contacts?.telegram}</Typography>
                            </Box>
                            <Box sx={infoWrapper}>
                                <span>Tax rate</span>
                                {data?.tax && <Typography>{data?.tax} $ per stroke</Typography>}
                            </Box>
                        </Box>
                        <Box sx={infoInnerStyle}>
                            {role !== AUDITOR &&
                                <Box sx={infoWrapper}>
                                    <span>Company</span>
                                    <Typography noWrap={true}>{data.company}</Typography>
                                </Box>
                            }
                            <Box sx={infoWrapper}>
                                <span>E-mail</span>
                                <Typography noWrap={true}>{data.contacts?.email}</Typography>
                            </Box>
                            <TagsList data={data.tags}/>
                        </Box>
                    </Box>
                </Box>
                <Button
                    sx={[buttonSx, role === 'auditor' ? submitAuditor : {}]}
                    variant={'contained'}
                    onClick={handleEdit}
                >
                    Edit
                </Button>
            </Box>
        );
    }
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
        fontSize: 'inherit',
        maxWidth: '250px',
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
            marginRight: '20px',
        },
        '& p': {
            maxWidth: '190px'
        }
    },
    [theme.breakpoints.down('xs')]: {
        fontSize: '12px'
    }
})
