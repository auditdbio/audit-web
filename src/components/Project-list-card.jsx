import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, Modal, Tooltip, Typography } from '@mui/material';
import AuditRequestInfo from './audit-request-info.jsx';
import TagsList from './tagsList.jsx';
import { clearMessage } from '../redux/actions/auditAction.js';
import CustomSnackbar from './custom/CustomSnackbar.jsx';
import { addTestsLabel } from '../lib/helper.js';

const ProjectListCard = ({ project }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState(null);
  const errorMessage = useSelector(s => s.audits.error);
  const successMessage = useSelector(s => s.audits.successMessage);
  const dispatch = useDispatch();
  const [errorState, setErrorState] = useState(null);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleError = () => {
    setMessage('Switched to auditor role');
  };

  return (
    <Box sx={wrapper}>
      <CustomSnackbar
        autoHideDuration={3000}
        open={!!message || errorMessage || successMessage || errorState}
        onClose={() => {
          setMessage(null);
          dispatch(clearMessage());
          setErrorState(null);
        }}
        severity={errorMessage || errorState ? 'error' : 'success'}
        text={message || errorMessage || successMessage || errorState}
      />

      <Box sx={contentWrapper}>
        <Tooltip title={project.name} arrow placement={'top'}>
          <Typography sx={projectTitleWrapper}>{project.name}</Typography>
        </Tooltip>
        <TagsList data={project.tags} />
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          height: '100%',
        }}
      >
        <Typography>${project.price}</Typography>
        <Button
          color={'secondary'}
          size={'small'}
          sx={viewButton}
          variant={'contained'}
          onClick={handleOpen}
          {...addTestsLabel('projects_view-more-button')}
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
            isModal={true}
            redirect={true}
            setError={setErrorState}
          />
        </Box>
      </Modal>
    </Box>
  );
};

export default ProjectListCard;

const contentWrapper = theme => ({
  display: 'flex',
  flexDirection: 'column',
  '& .tagsWrapper': {},
});

const projectTitleWrapper = theme => ({
  marginBottom: '18px',
  height: '80px',
  overflow: 'hidden',
  wordBreak: 'break-word',
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
  },
});

const viewButton = theme => ({
  width: '130px',
  textTransform: 'unset',
  fontWeight: 600,
  marginTop: '33px',
  [theme.breakpoints.down('xs')]: {
    width: '100px',
    fontSize: '9px',
  },
});

const wrapper = theme => ({
  padding: '22px 33px 22px 45px',
  display: 'flex',
  justifyContent: 'space-between',
  height: '100%',
  gap: '20px',
  [theme.breakpoints.down('sm')]: {
    paddingX: '20px',
    '& .MuiChip-root': {
      fontSize: '10px',
    },
  },
  [theme.breakpoints.down('xs')]: {
    paddingX: '10px',
    gap: '5px',
  },
});

const modalWrapper = theme => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700,
  // maxHeight: '90%',
  borderRadius: '14px',
  // height: '100%',
  '& .audit-content': {
    maxHeight: '30vw',
    overflowY: 'auto',
  },
  '& .audit-request-button-wrapper': {
    marginTop: '20px',
  },
  '& .audit-request-wrapper': {
    gap: '5px',
    paddingBottom: '40px',
    paddingX: '35px',
    paddingRight: '15px',
  },
  [theme.breakpoints.down('md')]: {
    '& .audit-request-wrapper': {
      paddingX: '20px',
      minHeight: 'unset',
    },
  },
  [theme.breakpoints.down('sm')]: {
    '& .audit-content': {
      maxHeight: '35vw',
    },
  },
  [theme.breakpoints.down('xs')]: {
    width: 340,
    '& .audit-content': {
      maxHeight: '50vw',
    },
  },
  [theme.breakpoints.down(500)]: {
    '& .audit-content': {
      maxHeight: '100vw',
    },
  },
});
