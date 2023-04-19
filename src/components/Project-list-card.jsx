import React, {useState} from 'react';
import {Alert, AlertTitle, Box, Button, Modal, Snackbar, Stack, Typography} from "@mui/material";
import AuditRequestInfo from "./audit-request-info.jsx";
import TagsList from "./tagsList.jsx";

const ProjectListCard = ({project}) => {
    const [isOpen, setIsOpen] = useState(false)
    const [error, setError] = useState(null)

    const handleOpen = () => {
        setIsOpen(true)
    }

    const handleClose = () => {
        setIsOpen(false)
    }

    const handleError = () => {
        setError('Your role is not an auditor')
    }

    return (
        <Box sx={wrapper}>
            <Snackbar
                autoHideDuration={10000}
                open={!!error}
                anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
                onClose={() => setError(null)}
            >
                <Stack sx={{ width: '100%', flexDirection: 'column', gap: 2 }} spacing={2}>
                    <Alert severity='error'>
                        <AlertTitle>{error}</AlertTitle>
                    </Alert>
                </Stack>
            </Snackbar>
            <Box sx={contentWrapper}>
                <Typography sx={{marginBottom: '33px'}}>
                    {project.name}
                </Typography>
                <TagsList data={project.tags}/>
            </Box>
            <Box sx={{display: 'flex', alignItems: 'center', flexDirection: 'column', height: '100%'}}>
                <Typography>
                    {project.price} $
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
                        modal={true}/>
                </Box>
            </Modal>
        </Box>
    );
};

export default ProjectListCard;

const contentWrapper = (theme) => ({
    display: 'flex',
    flexDirection: 'column',
    '& .tagsWrapper': {

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
    border: '1px solid #B2B3B3',
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