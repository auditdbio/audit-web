import React from 'react';
import {Box, Button, Typography} from "@mui/material";
import Currency from "./icons/Currency.jsx";
import Star from "./icons/Star.jsx";
import theme, {radiusOfComponents} from "../styles/themes.js";
import {useNavigate} from "react-router-dom/dist";
import {useDispatch} from "react-redux";
import {deleteAudit} from "../redux/actions/auditAction.js";

const AuditRequestCard = ({type, request}) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    return (
        <Box sx={cardWrapper}>
            <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <Typography variant={'h5'}>
                    {request.project_name}
                </Typography>
                <Typography sx={categorySx}>
                    Criptography, Games
                </Typography>
                <Box sx={priceWrapper}>
                    <Box sx={infoWrapper}>
                        <Currency/>
                        <Typography>{request.price}</Typography>
                    </Box>
                    <Box sx={infoWrapper}>
                        <Star/>
                        <Typography>150</Typography>
                    </Box>
                </Box>
            </Box>
            <Box sx={buttonWrapper}>
                <Button
                    variant={'contained'}
                    sx={[actionButton, type === 'auditor' ? editAuditor : {}]}
                    onClick={() => navigate(`/audit-request/${request.id}`)}
                >
                    View
                </Button>
                <Button sx={[actionButton, copyBtn]}
                        onClick={() => dispatch(deleteAudit(request.id))}
                        variant={'contained'}
                >
                    Decline
                </Button>
            </Box>
        </Box>
    );
};

export default AuditRequestCard;

const buttonWrapper = (theme) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    gap: '7px',
    mt: '24px',
    [theme.breakpoints.down('xs')]: {
        flexDirection: 'column',
        width: 'unset',
        justifyContent: 'unset',
        mt: 0
    }
})

const priceWrapper = (theme) => ({
    display: 'flex',
    gap: '30px',
    mt: '18px',
    [theme.breakpoints.down('md')]: {
        gap: '18px'
    },
    [theme.breakpoints.down('xs')]: {
        mt: '5px'
    }
})

const copyBtn = (theme) => ({
    backgroundColor: theme.palette.secondary.main,
})

const actionButton = (theme) => ({
    fontSize: '12px',
    fontWeight: 600,
    lineHeight: '25px',
    width: '100%',
    height: '34px',
    textTransform: 'none',
    borderRadius: '7px',
    gap: '40px',
    padding: '9px 0',
    [theme.breakpoints.down('md')]: {
        width: '100px',
        height: '30px',
    },
    [theme.breakpoints.down('xs')]: {
        fontSize: '11px',
        height: '26px',
    }
})

const editAuditor = (theme) => ({
    backgroundColor: theme.palette.secondary.main,
    '&:hover': {
        backgroundColor: '#450e5d'
    }
})

const infoWrapper = (theme) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    '& p': {
        fontSize: '12px!important',
        marginLeft: '8px'
    },
    [theme.breakpoints.down('xs')]: {
        '& p': {
            fontSize: '10px!important',
        },
        '& svg': {
            width: '10px',
            height: '10px'
        }
    }
})

const categorySx = (theme) => ({
    textAlign: 'center',
    fontSize: '12px!important',
    fontWeight: 500,
    color: '#434242',
    margin: '10px 0 7px',
    [theme.breakpoints.down('xs')]: {
        fontSize: '10px!important',
    }
})

const cardWrapper = (theme) => ({
    display: 'flex',
    flexDirection: 'column',
    padding: '30px 14px',
    boxShadow: '0px 64.1377px 76.5824px rgba(0, 0, 0, 0.07),' +
        ' 0px 14.326px 17.1057px rgba(0, 0, 0, 0.0417275),' +
        '0px 8.03104px 9.5893px rgba(0, 0, 0, 0.035), ' +
        '0px 4.26523px 5.09281px rgba(0, 0, 0, 0.0282725), ' +
        '0px 1.77486px 2.11923px rgba(0, 0, 0, 0.0196802)',
    borderRadius: '25px',
    border: '1px solid rgba(67, 66, 66, 0.1)',
    alignItems: 'center',
    '& h5': {
        fontSize: '18px',
        fontWeight: 500,
        lineHeight: '22px'
    },
    [theme.breakpoints.down('md')]: {
        padding: '33px 22px 24px'
    },
    [theme.breakpoints.down('xs')]: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: '15px 10px',
        '& h5': {
            fontSize: '14px',
            fontWeight: 500,
        },
    }
})