import React, {useEffect, useState} from 'react';
import {Alert, AlertTitle, Box, Button, Modal, Snackbar, Stack, Tooltip, Typography} from "@mui/material";
import AuditRequestInfo from "./audit-request-info.jsx";
import TagsList from "./tagsList.jsx";
import {useDispatch, useSelector} from "react-redux";
import {clearMessage} from "../redux/actions/auditAction.js";

const ProjectListCard = ({project}) => {
    const [isOpen, setIsOpen] = useState(false)
    const [message, setMessage] = useState(null)
    const errorMessage = useSelector(s => s.audits.error)
    const successMessage = useSelector(s => s.audits.successMessage)
    const dispatch = useDispatch()

    const handleOpen = () => {
        setIsOpen(true)
    }

    const handleClose = () => {
        setIsOpen(false)
    }

    const handleError = () => {
        setMessage('Switched to auditor role')
    }

    return (
        <Box sx={wrapper}>
            <Snackbar
                autoHideDuration={3000}
                open={!!message || errorMessage || successMessage}
                anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                onClose={() => {
                    setMessage(null)
                    dispatch(clearMessage())
                }}
            >
                <Stack sx={{width: '100%', flexDirection: 'column', gap: 2}} spacing={2}>
                    <Alert severity={errorMessage ? 'error' : 'success'}>
                        <AlertTitle>{message || errorMessage || successMessage}</AlertTitle>
                    </Alert>
                </Stack>
            </Snackbar>
            <Box sx={contentWrapper}>
                <Tooltip
                    title={project.name}
                    arrow placement={'top'}>
                    <Typography sx={projectTitleWrapper}>
                        {project.name}
                    </Typography>
                </Tooltip>
                <TagsList data={project.tags}/>
            </Box>
            <Box sx={{display: 'flex', alignItems: 'center', flexDirection: 'column', height: '100%'}}>
                <Typography>
                    ${project.price}
                </Typography>
                <Button
                    color={'secondary'}
                    size={'small'}
                    sx={viewButton}
                    variant={'contained'}
                    onClick={handleOpen}
                >
                    View more
                </Button>
            </Box>
            <Modal
                open={isOpen}
                onClose={handleClose}
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description"
            >
                <Box sx={modalWrapper}>
                    <AuditRequestInfo
                        onClose={handleClose}
                        project={project}
                        handleError={handleError}
                        modal={true}
                        redirect={true}
                    />
                </Box>
            </Modal>
        </Box>
    );
};

export default ProjectListCard;

const contentWrapper = (theme) => ({
    display: 'flex',
    flexDirection: 'column',
    '& .tagsWrapper': {}
})

const projectTitleWrapper = (theme) => ({
    marginBottom: '18px',
    height: '80px',
    overflow: 'hidden',
    '-webkit-line-clamp': '2',
    '-webkit-box-orient': 'vertical',
    'text-overflow': 'ellipsis',
    display: '-webkit-box',
    [theme.breakpoints.down('lg')]: {
        height: '70px',
    },
    [theme.breakpoints.down('md')]: {
        height: '60px',
    },
    [theme.breakpoints.down('sm')]: {
        height: '45px',
    }
})

const viewButton = (theme) => ({
    width: '170px',
    textTransform: 'unset',
    marginTop: '33px',
    [theme.breakpoints.down('md')]: {
        width: '130px'
    },
    [theme.breakpoints.down('xs')]: {
        width: '100px',
        fontSize: '9px'
    }
})


const wrapper = (theme) => ({
    padding: '22px 33px 22px 45px',
    display: 'flex',
    justifyContent: 'space-between',
    height: '100%',
    gap: '20px',
    [theme.breakpoints.down('sm')]: {
        paddingX: '20px',
        '& .MuiChip-root': {
            fontSize: '10px'
        }
    }
})

export const modalWrapper = (theme) => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
    height: '90%',
    overflow: 'auto',
    borderRadius: '14px',
    '& .audit-request-wrapper': {
        gap: '100px',
        paddingX: '35px'
    },
    '& .audit-request-links': {
        gap: '20px'
    },
    [theme.breakpoints.down('xs')]: {
        width: 360,
        '& .audit-request-wrapper': {
            gap: '30px',
            paddingX: '15px'
        },
    }
})