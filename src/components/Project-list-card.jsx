import React, {useState} from 'react';
import {Box, Button, Modal, Typography} from "@mui/material";
import AuditRequestInfo from "./audit-request-info.jsx";
import TagsList from "./tagsList.jsx";

const ProjectListCard = ({project}) => {
    const [isOpen, setIsOpen] = useState(false)

    const handleOpen = () => {
        setIsOpen(true)
    }

    const handleClose = () => {
        setIsOpen(false)
    }

    return (
        <Box sx={wrapper}>
            <Box sx={{display: 'flex', flexDirection: 'column'}}>
                <Typography sx={{marginBottom: '33px'}}>
                    {project.name}
                </Typography>
                <TagsList data={project.tags}/>
            </Box>
            <Box sx={{display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
                <Typography>
                    {project.publish_options.prise_to} $
                </Typography>
                <Button
                    color={'secondary'}
                    size={'small'}
                    sx={{width: '170px', textTransform: 'unset', marginTop: '33px'}}
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
                    <AuditRequestInfo onClose={handleClose} project={project} modal={true}/>
                </Box>
            </Modal>
        </Box>
    );
};

export default ProjectListCard;

const tags = [
    'java', 'pithon', 'js'
]

const wrapper = (theme) => ({
    padding: '22px 33px 22px 45px',
    border: '1px solid #B2B3B3',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
})

const modalWrapper = (theme) => ({
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