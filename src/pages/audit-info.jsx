import React, {useMemo} from 'react';
import {CustomCard} from "../components/custom/Card.jsx";
import Layout from "../styles/Layout.jsx";
import {Avatar, Box, Button, Typography, Link} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import theme from "../styles/themes.js";
import {useNavigate} from "react-router-dom/dist";
import TagsList from "../components/tagsList.jsx";
import {useDispatch, useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import {acceptAudit, confirmAudit, deleteAudit, deleteAuditRequest} from "../redux/actions/auditAction.js";
import {CUSTOMER, DONE, SUBMITED} from "../redux/actions/types.js";
import dayjs from "dayjs";

const AuditInfo = () => {
    const navigate = useNavigate()
    const {id} = useParams()
    const auditRequest = useSelector(s => s.audits?.auditRequests?.find(audit => audit.id === id))
    const auditConfirm = useSelector(s => s.audits?.audits?.find(audit => audit.id === id))
    const audit = useMemo(() => {
        if (auditRequest && !auditConfirm){
            return auditRequest
        } else {
           return auditConfirm
        }
    },[id, auditConfirm, auditRequest])
    const dispatch = useDispatch()

    const handleConfirm = () => {
        dispatch(confirmAudit(audit))
    }

    const handleDecline = () => {
        if (audit?.status){
            dispatch(deleteAudit(audit.id))
        } else {
            dispatch(deleteAuditRequest(audit.id))
        }
    }

    const handleAcceptAudit = () => {
        dispatch(acceptAudit({
            id: audit.id,
            report: audit.report,
            status: SUBMITED
        }))
    }

    return (
        <Layout>
            <CustomCard sx={wrapper}>
                <Box sx={{display: 'flex', width: '100%', position: 'relative'}}>
                   <Button sx={backButtonSx} onClick={() => navigate(-1)}>
                       <ArrowBackIcon/>
                   </Button>
                    <Typography sx={{width: '100%', textAlign: 'center'}}>
                        You have offer to audit for <span style={{fontWeight: 500}}>
                        {audit?.project_name}
                    </span> project!
                    </Typography>
                </Box>
                <Box>
                    <Box sx={contentWrapper}>
                        <Box sx={userWrapper}>
                            <Avatar src={audit?.avatar}/>
                            <Box>
                                <Typography>
                                    {audit?.auditor_contacts?.email}
                                </Typography>
                                <Typography>
                                    {audit?.auditor_contacts?.telegram}
                                </Typography>
                            </Box>
                        </Box>
                        <Box sx={userInfoWrapper}>
                            <Box sx={infoWrapper}>
                                <span>E-mail</span>
                                <Typography>{audit?.auditor_contacts?.email}</Typography>
                            </Box>
                            <Box sx={infoWrapper}>
                                <span>Telegram</span>
                                <Typography>{audit?.auditor_contacts?.telegram}</Typography>
                            </Box>
                            <Box sx={infoWrapper}>
                                <span>Price:</span>
                                <Typography>${audit?.price} per line</Typography>
                            </Box>
                        </Box>
                        <Box sx={projectWrapper}>
                            <Typography>Time for project</Typography>
                            <Box sx={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                                <Box sx={dateWrapper}>{dayjs(audit?.time?.begin).format('DD.MM.YYYY') }</Box>
                                -
                                <Box sx={dateWrapper}>{dayjs(audit?.time?.end).format('DD.MM.YYYY') }</Box>
                            </Box>
                            <TagsList/>
                        </Box>
                    </Box>
                    <Box sx={{marginY: '15px', overflow: 'auto', maxHeight: '150px', paddingY: '5px'}}>{audit?.description}</Box>
                    { (audit?.status === DONE || audit?.status === SUBMITED) &&
                        <Box sx={{display: 'flex', justifyContent: 'center'}}>
                            <Link
                                href={audit.report}
                                download={true}
                                target={'_blank'}
                                sx={{margin: '15px auto 0', display: 'block'}}
                            >
                                Report
                            </Link>
                        </Box>
                    }
                </Box>
                <Box>
                    { auditRequest &&
                        <Button
                            variant={'contained'}
                            sx={buttonSx}
                            disabled={audit?.last_changer.toLowerCase() === CUSTOMER}
                            onClick={handleConfirm}
                        >
                            Accept
                        </Button>
                    }
                    { (audit?.status !== SUBMITED && audit?.status === DONE) &&
                        <Button
                            variant={'contained'}
                            sx={buttonSx}
                            onClick={handleAcceptAudit}
                        >
                            Confirm
                        </Button>
                    }
                    { audit?.status !== SUBMITED &&
                        <Button
                            variant={'contained'}
                            onClick={handleDecline}
                            sx={[buttonSx, {backgroundColor: theme.palette.secondary.main}]}
                        >
                                Cancel
                        </Button>
                    }

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
        alignItems: 'center',
        gap: '16px',
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
            margin: '13px 0 18px'
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