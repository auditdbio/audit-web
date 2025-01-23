import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  ClickAwayListener,
  Popover,
  Tooltip,
  Typography,
} from '@mui/material';
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
  const handleCloseModal = () => {
    setIsOpen(false);
  };
  const handleOpen = () => {
    setIsOpen(true);
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
        <Tooltip title={project.name} arrow placement="top">
          <Typography onClick={handleOpen} sx={projectTitleWrapper}>
            {project.name}
          </Typography>
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
        {(project.price || project.total_cost) > 0 && (
          <>
            <Typography>$ {project.price || project.total_cost}</Typography>
            {project.total_cost && (
              <Typography color={'grey'} sx={{ fontSize: '14px', mt: '7px' }}>
                total cost
              </Typography>
            )}
          </>
        )}
        <Button
          color="secondary"
          size="small"
          sx={viewButton}
          variant="contained"
          onClick={handleOpen}
          {...addTestsLabel('projects_view-more-button')}
        >
          View more
        </Button>
      </Box>
      <ClickAwayListener onClickAway={handleCloseModal}>
        <>
          {isOpen ? (
            <Popover
              anchorEl={null}
              open={isOpen}
              onClose={handleCloseModal}
              sx={{
                '& .MuiPopover-paper': {
                  position: 'absolute',
                  backgroundColor: '#FCFAF6',
                  top: '50%!important',
                  left: '50%!important',
                  transform: 'translate(-50%, -50%)!important',
                  width: '100%',
                  maxHeight: '90vh',
                  overflowY: 'hidden',
                  borderRadius: '14px',
                  '& .rc-md-editor': {
                    height: '100%!important',
                  },
                  '& .audit-request-wrapper': {
                    paddingBottom: '10px',
                    minHeight: 'unset',
                  },
                  '& .request-content-sx': {
                    maxHeight: 'calc(100vh - 233px)',
                    overflowY: 'auto',
                  },
                  '& .audit-request-button-wrapper': {
                    marginTop: '0',
                  },
                },
              }}
            >
              <Box>
                <AuditRequestInfo
                  onClose={handleCloseModal}
                  project={project}
                  handleError={handleError}
                  isModal={true}
                  redirect={true}
                  hideChange={true}
                  setError={setErrorState}
                />
              </Box>
            </Popover>
          ) : null}
        </>
      </ClickAwayListener>
    </Box>
  );
};

export default ProjectListCard;

const contentWrapper = {
  display: 'flex',
  flexDirection: 'column',
};

const projectTitleWrapper = theme => ({
  marginBottom: '10px',
  cursor: 'pointer',
  height: '90px',
  overflow: 'hidden',
  wordBreak: 'break-word',
  '-webkit-line-clamp': '2',
  '-webkit-box-orient': 'vertical',
  'text-overflow': 'ellipsis',
  display: '-webkit-box',
  [theme.breakpoints.down('lg')]: {
    height: '60px',
  },
  [theme.breakpoints.down('md')]: {
    height: '50px',
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
  padding: '12px 20px 12px 45px',
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
