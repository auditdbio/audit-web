import React, {useEffect, useState} from 'react';
import {CustomCard} from "./custom/Card.jsx";
import Layout from "../styles/Layout.jsx";
import {
    Avatar,
    Box,
    Button,
    Typography,
    Link,
    useMediaQuery,
    Modal,
    TextField,
    Stack,
    Alert,
    AlertTitle, Snackbar, Tooltip
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack.js";
import GitHubIcon from '@mui/icons-material/GitHub';
import theme from "../styles/themes.js";
import {useNavigate} from "react-router-dom/dist";
import SalarySlider from "./forms/salary-slider/salary-slider.jsx";
import {Form, Formik, Field} from "formik";
import * as Yup from "yup";
import {useDispatch, useSelector} from "react-redux";
import {clearMessage, createRequest, deleteAuditRequest} from "../redux/actions/auditAction.js";
import dayjs from "dayjs";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {LocalizationProvider} from "@mui/x-date-pickers";
import Markdown from "./custom/Markdown.jsx";
import {isAuth} from "../lib/helper.js";
import {AUDITOR} from "../redux/actions/types.js";
import {changeRolePublicAuditor, changeRolePublicAuditorNoRedirect} from "../redux/actions/userAction.js";
import TelegramIcon from '@mui/icons-material/Telegram';
import EmailIcon from '@mui/icons-material/Email';

const AuditRequestInfo = ({project, onClose, handleError, redirect, isModal}) => {
    const navigate = useNavigate()
    const matchXs = useMediaQuery(theme.breakpoints.down('xs'))
    const [open, setOpen] = useState(false)
    const auditor = useSelector(s => s.auditor.auditor)
    const user = useSelector(s => s.user.user)
    const dispatch = useDispatch()

    const handleOpen = () => {
        if (user.current_role === AUDITOR && isAuth() && auditor?.first_name && auditor?.last_name) {
            setOpen(true);
        } else if (user.current_role !== AUDITOR && isAuth() && auditor?.first_name && auditor?.last_name) {
            dispatch(changeRolePublicAuditorNoRedirect(AUDITOR, user.id, auditor))
            handleError()
            setOpen(true)
        } else if (!auditor?.first_name && !auditor?.last_name && user.current_role === AUDITOR && isAuth()) {
            dispatch(changeRolePublicAuditor(AUDITOR, user.id, auditor))
        } else if (user.current_role !== AUDITOR && isAuth() && !auditor?.first_name && !auditor?.last_name) {
            dispatch(changeRolePublicAuditor(AUDITOR, user.id, auditor))
            handleError()
            setOpen(true)
        } else {
            navigate('/sign-in')
        }
    }

    const handleClose = () => {
        setOpen(false);
    };

    const handleBack = () => {
        if (onClose) {
            onClose()
        } else {
            navigate(-1)
        }
    }

    return (
        <CustomCard sx={wrapper} className={'audit-request-wrapper'}>
            <Box sx={{display: 'flex', width: '100%', position: 'relative'}}>
                <Button sx={backButtonSx} className={'audit-request-back-btn'}
                        onClick={handleBack}>
                    <ArrowBackIcon color={'secondary'}/>
                </Button>
                <Typography variant={'h3'} sx={{width: '100%', textAlign: 'center'}}>
                    {project?.name || project?.project_name}
                </Typography>
            </Box>
            <Box sx={{width: '100%'}}>
                <Box sx={contentWrapper} className={'audit-request-content-wrapper'}>
                    <Typography sx={titleSx} className={'audit-request-title'}>
                        {project?.tags?.map(el => el).join(', ') ?? ''}
                    </Typography>
                    <Box sx={salaryWrapper} className={'audit-request-salary'}>
                        <Box sx={{display: 'flex', alignItems: 'center', gap: '15px'}}>
                            <svg width="27" height="26" viewBox="0 0 27 26" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M13.6131 0.249512C11.1111 0.249512 8.66532 0.991432 6.58501 2.38145C4.5047 3.77147 2.8833 5.74716 1.92583 8.05868C0.968372 10.3702 0.717856 12.9137 1.20597 15.3676C1.69408 17.8215 2.89889 20.0756 4.66805 21.8447C6.43721 23.6139 8.69125 24.8187 11.1451 25.3068C13.599 25.7949 16.1426 25.5444 18.4541 24.5869C20.7656 23.6295 22.7413 22.0081 24.1313 19.9278C25.5213 17.8474 26.2633 15.4017 26.2633 12.8997C26.2568 9.54663 24.922 6.33274 22.551 3.96177C20.18 1.59079 16.9661 0.255941 13.6131 0.249512ZM15.0727 18.7382H14.5862V19.7113C14.5862 19.9694 14.4836 20.2169 14.3012 20.3994C14.1187 20.5819 13.8712 20.6844 13.6131 20.6844C13.355 20.6844 13.1075 20.5819 12.925 20.3994C12.7425 20.2169 12.64 19.9694 12.64 19.7113V18.7382H10.6938C10.4357 18.7382 10.1882 18.6357 10.0057 18.4532C9.82324 18.2707 9.72071 18.0232 9.72071 17.7651C9.72071 17.5071 9.82324 17.2596 10.0057 17.0771C10.1882 16.8946 10.4357 16.7921 10.6938 16.7921H15.0727C15.4598 16.7921 15.8311 16.6383 16.1048 16.3645C16.3786 16.0908 16.5323 15.7195 16.5323 15.3324C16.5323 14.9453 16.3786 14.574 16.1048 14.3003C15.8311 14.0266 15.4598 13.8728 15.0727 13.8728H12.1534C11.2502 13.8728 10.3839 13.514 9.74516 12.8752C9.10645 12.2365 8.74762 11.3702 8.74762 10.467C8.74762 9.56369 9.10645 8.6974 9.74516 8.05869C10.3839 7.41997 11.2502 7.06115 12.1534 7.06115H12.64V6.08806C12.64 5.82998 12.7425 5.58247 12.925 5.39998C13.1075 5.21749 13.355 5.11497 13.6131 5.11497C13.8712 5.11497 14.1187 5.21749 14.3012 5.39998C14.4836 5.58247 14.5862 5.82998 14.5862 6.08806V7.06115H16.5323C16.7904 7.06115 17.0379 7.16367 17.2204 7.34616C17.4029 7.52865 17.5054 7.77616 17.5054 8.03424C17.5054 8.29232 17.4029 8.53983 17.2204 8.72232C17.0379 8.90481 16.7904 9.00733 16.5323 9.00733H12.1534C11.7663 9.00733 11.3951 9.16111 11.1213 9.43485C10.8476 9.70858 10.6938 10.0798 10.6938 10.467C10.6938 10.8541 10.8476 11.2253 11.1213 11.4991C11.3951 11.7728 11.7663 11.9266 12.1534 11.9266H15.0727C15.976 11.9266 16.8423 12.2854 17.481 12.9241C18.1197 13.5629 18.4785 14.4291 18.4785 15.3324C18.4785 16.2357 18.1197 17.102 17.481 17.7407C16.8423 18.3794 15.976 18.7382 15.0727 18.7382Z"
                                    fill="#FF9900"/>
                            </svg>
                            {project?.price}
                        </Box>
                        <Box sx={{display: 'flex', alignItems: 'center', gap: '15px'}}>
                            <svg width="26" height="26" viewBox="0 0 26 26" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M13.2559 25.5499C20.2424 25.5499 25.9061 19.8862 25.9061 12.8997C25.9061 5.91319 20.2424 0.249512 13.2559 0.249512C6.26939 0.249512 0.605713 5.91319 0.605713 12.8997C0.605713 19.8862 6.26939 25.5499 13.2559 25.5499Z"
                                    fill="#52176D"/>
                                <path
                                    d="M13.257 4.64941L15.4702 9.71865L20.4071 10.5528L16.8321 14.4671L17.6833 20.0496L13.257 17.4188L8.83078 20.0496L9.68199 14.4671L6.10693 10.5528L11.0439 9.71865L13.257 4.64941Z"
                                    fill="#FFCA28"/>
                            </svg>
                            150
                        </Box>
                    </Box>
                    {!matchXs &&
                        <Box sx={{display: 'flex', gap: '25px', flexWrap: 'wrap'}}>
                            <Box sx={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                                <EmailIcon/>
                                <Box sx={{display: 'grid'}}>
                                    <Tooltip
                                        title={project?.creator_contacts?.email || project?.customer_contacts?.email}
                                        arrow placement={'top'}>
                                        <Typography variant={'caption'} sx={contactStyle} noWrap={true}>
                                            {project?.creator_contacts?.email || project?.customer_contacts?.email}
                                        </Typography>
                                    </Tooltip>
                                </Box>
                            </Box>
                            <Box sx={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                                <TelegramIcon/>
                                <Box sx={{display: 'grid'}}>
                                    <Tooltip
                                        title={project?.creator_contacts?.telegram || project?.customer_contacts?.telegram}
                                        arrow placement={'top'}
                                    >
                                        <Typography variant={'caption'} sx={contactStyle} noWrap={true}>
                                            {project?.creator_contacts?.telegram || project?.customer_contacts?.telegram}
                                        </Typography>
                                    </Tooltip>
                                </Box>
                            </Box>
                        </Box>
                    }
                </Box>
                <Box sx={infoWrapper} className={'audit-request-info'}>
                    <Markdown value={project?.description}/>
                    {matchXs &&
                        <Box sx={{display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center',}}>
                            <Box sx={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                                <EmailIcon/>
                                <Box sx={{display: 'grid'}}>
                                    <Tooltip
                                        title={project?.creator_contacts?.email || project?.customer_contacts?.email}
                                        arrow placement={'top'}>
                                        <Typography variant={'caption'} sx={contactStyle} noWrap={true}>
                                            {project?.creator_contacts?.email || project?.customer_contacts?.email}
                                        </Typography>
                                    </Tooltip>
                                </Box>
                            </Box>
                            <Box sx={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                                <TelegramIcon/>
                                <Box sx={{display: 'grid'}}>
                                    <Tooltip
                                        title={project?.creator_contacts?.telegram || project?.customer_contacts?.telegram}
                                        arrow placement={'top'}
                                    >
                                        <Typography variant={'caption'} sx={contactStyle} noWrap={true}>
                                            {project?.creator_contacts?.telegram || project?.customer_contacts?.telegram}
                                        </Typography>
                                    </Tooltip>
                                </Box>
                            </Box>
                        </Box>
                    }
                    <Box sx={linkWrapper} className={'audit-request-links'}>
                        {project?.scope?.map((el, idx) =>
                            <Typography key={idx} noWrap={true}>
                                <GitHubIcon/>
                                <Link>{el}</Link>
                            </Typography>
                        )}
                    </Box>
                </Box>
            </Box>
            <Box sx={buttonWrapper} className={'audit-request-button-wrapper'}>
                <Button
                    variant={'contained'}
                    sx={[buttonSx, {backgroundColor: theme.palette.secondary.main}]}
                    onClick={() => {
                        if (isModal) {
                            handleBack()
                        } else {
                            dispatch(deleteAuditRequest(project.id))
                        }
                    }}
                >
                    {
                        isModal ? 'Cancel' : 'Decline'
                    }
                </Button>
                <Button
                    variant={'contained'}
                    sx={buttonSx}
                    onClick={handleOpen}
                >
                    Make offer
                </Button>
            </Box>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="child-modal-title"
                aria-describedby="child-modal-description"
                disableScrollLock
            >
                <Box sx={modalWrapper}>
                    <Button sx={backButtonConfirm} className={'audit-request-back-btn'} onClick={handleClose}>
                        <ArrowBackIcon color={'secondary'}/>
                    </Button>
                    <Formik
                        validationSchema={MakeOfferSchema}
                        validator={() => ({})}
                        initialValues={{
                            auditor_id: auditor?.user_id,
                            auditor_contacts: {...auditor?.contacts},
                            customer_contacts: {...project?.creator_contacts},
                            customer_id: project?.customer_id,
                            last_changer: user.current_role,
                            price: project?.price || '',
                            description: project?.description || '',
                            price_range: {
                                from: project?.price || '',
                                to: project?.price || ''
                            },
                            time: {
                                from: dayjs(project?.time?.from) || new Date(),
                                to: dayjs(project?.time?.to) || new Date()
                            },
                            project_id: project?.project_id || project?.id,
                            scope: project?.scope,
                            time_frame: ''
                        }}
                        onSubmit={(values) => {
                            const newValue = {
                                ...values,
                                price: parseInt(values.price),
                                price_range: {
                                    from: parseInt(values.price),
                                    to: parseInt(values.price)
                                }
                            }
                            dispatch(createRequest(newValue, redirect))
                            handleClose()
                            if (onClose) {
                                onClose()
                            }
                        }}
                    >
                        {({handleSubmit, setFieldValue, values}) => {
                            return (
                                <Form onSubmit={handleSubmit}>
                                    <Typography variant={'h5'} sx={{width: '100%', textAlign: 'center'}}>
                                        Add more info
                                    </Typography>
                                    <Box sx={{width: '100%'}}>
                                        <Typography variant={'caption'}>
                                            Price per line of code
                                        </Typography>
                                        <SalarySlider name={'price'}/>
                                    </Box>
                                    <Box>
                                        <Typography variant={'caption'}>
                                            Time frame
                                        </Typography>
                                        <Box sx={{
                                            display: 'flex',
                                            gap: '20px',
                                            marginTop: '15px',
                                            alignItems: 'center'
                                        }}>
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <Field
                                                    component={DatePicker}
                                                    name={'time.from'}
                                                    value={dayjs(values.time?.from)}
                                                    sx={dateStyle}
                                                    inputFormat='DD.MM.YYYY'
                                                    onChange={(e) => {
                                                        const value = new Date(e)
                                                        setFieldValue('time.from', value.toString())
                                                    }}
                                                    disablePast
                                                    minDate={new Date()}
                                                />
                                                <Typography variant={"caption"}>-</Typography>
                                                <Field
                                                    component={DatePicker}
                                                    value={dayjs(values.time?.to)}
                                                    sx={dateStyle}
                                                    onChange={(e) => {
                                                        const value = new Date(e)
                                                        setFieldValue('time.to', value.toString())
                                                    }}
                                                    minDate={dayjs(values.time?.from)}
                                                    disablePast
                                                    inputFormat='DD.MM.YYYY'
                                                />
                                            </LocalizationProvider>
                                        </Box>
                                    </Box>
                                    <Button
                                        variant={'contained'}
                                        sx={submitBtn}
                                        type={'submit'} color={'secondary'}>
                                        Send offer
                                    </Button>
                                </Form>
                            )
                        }}
                    </Formik>
                </Box>
            </Modal>
        </CustomCard>
    );
};

export default AuditRequestInfo;

const MakeOfferSchema = Yup.object().shape({
    auditor_contacts: Yup.object(),
    auditor_id: Yup.string(),
    customer_contacts: Yup.object(),
    customer_id: Yup.string(),
    opener: Yup.string(),
    price: Yup.number(),
    price_range: Yup.object(),
    project_id: Yup.string(),
    scope: Yup.array(),
    time_frame: Yup.string(),
    time: Yup.object().shape({
        from: Yup.date(),
        to: Yup.date()
            .required()
            .min(Yup.ref('from'))
    })
});

const contactStyle = (theme) => ({
    // display: 'flex',
    // alignItems: 'center',
    // gap: '10px'
})

const dateStyle = {
    width: "150px",
    "& .MuiPickersDay-day": {
        fontSize: "0.8rem",
        [theme.breakpoints.down("sm")]: {
            fontSize: "10px",
        },
    },
    "& .MuiInputBase-input": {
        fontSize: "0.8rem",
        [theme.breakpoints.down("sm")]: {
            fontSize: "10px",
        },
    },
    "& .MuiInputLabel-root": {
        fontSize: "0.8rem",
        [theme.breakpoints.down("sm")]: {
            fontSize: "10px",
        },
    },
    [theme.breakpoints.down('sm')]: {
        width: '130px'
    }
};


const modalWrapper = (theme) => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 650,
    backgroundColor: '#fff',
    border: '1.5px solid #D9D9D9',
    boxShadow: '0px 71.4286px 57.1429px rgba(0, 0, 0, 0.07),' +
        ' 0px 29.8412px 23.8729px rgba(0, 0, 0, 0.0503198), ' +
        '0px 15.9545px 12.7636px rgba(0, 0, 0, 0.0417275), ' +
        '0px 8.94397px 7.15517px rgba(0, 0, 0, 0.035), ' +
        '0px 4.75007px 3.80006px rgba(0, 0, 0, 0.0282725), ' +
        '0px 1.97661px 1.58129px rgba(0, 0, 0, 0.0196802)',
    borderRadius: '10.7143px',
    '& form': {
        paddingX: '100px',
        paddingY: '60px',
        display: 'flex',
        flexDirection: 'column',
        gap: '50px',
        alignItems: 'center',
    },
    [theme.breakpoints.down('sm')]: {
        width: 380,
        '& form': {
            paddingX: '20px',
            paddingY: '30px',
            gap: '30px'
        }
    },
    [theme.breakpoints.down('xs')]: {
        width: 350
    }

})

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

const backButtonConfirm = (theme) => ({})

const submitBtn = (theme) => ({
    textTransform: 'unset',
    width: '360px',
    paddingY: '24px',
    fontSize: '18px',
    borderRadius: '10px',
    [theme.breakpoints.down('sm')]: {
        width: '140px',
        paddingY: '12px'
    }
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
    [theme.breakpoints.down('sm')]: {
        '& span': {
            fontSize: '15px',
            fontWeight: 500
        }
    },
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
    },
    [theme.breakpoints.down('xs')]: {
        flexDirection: 'column',
        columnGap: 'unset',
        gap: '15px'
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
        fontSize: '12px'
    }
})