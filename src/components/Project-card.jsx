import React, { useState } from 'react';
import {
  Box,
  Button,
  Tooltip,
  Modal,
  Typography,
  FormControlLabel,
  Switch,
} from '@mui/material';
import Currency from './icons/Currency.jsx';
import Star from './icons/Star.jsx';
import {
  AUDITOR,
  DONE,
  RESOLVED,
  SUBMITED,
  WAITING_FOR_AUDITS,
} from '../redux/actions/types.js';
import { useNavigate } from 'react-router-dom/dist';
import { useDispatch, useSelector } from 'react-redux';
import { addTestsLabel } from '../lib/helper.js';
import { makeAuditPublic, startAudit } from '../redux/actions/auditAction.js';
import ShareProjectButton from './custom/ShareProjectButton.jsx';
import AuditRequestInfo from './audit-request-info.jsx';
import CustomSnackbar from './custom/CustomSnackbar.jsx';

const ProjectCard = ({ type, project, isPublic }) => {
  const navigate = useNavigate();
  const currentRole = useSelector(s => s.user.user.current_role);
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState(false);
  const [message, setMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleClick = () => {
    if (type === AUDITOR) {
      navigate(`/audit-info/${project.id}/auditor`);
      window.scrollTo({ top: 0, left: 0 });
    } else {
      navigate(`/edit-project/${project.id}`);
    }
  };

  const handleMakeCopy = () => {
    navigate(`/edit-project/${project.id}?copy=true`);
  };

  const handleStartAudit = () => {
    dispatch(startAudit(project));
  };

  const handleError = () => {
    setMessage('Switched to auditor role');
  };
  const handleView = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handlePublish = e => {
    const value = { ...project, isPublic: e.target.checked };
    dispatch(makeAuditPublic(value));
  };
  //
  return (
    <Box sx={cardWrapper} className={'project-wrapper'}>
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={modalWrapper}>
          <AuditRequestInfo
            onClose={handleCloseModal}
            project={project}
            handleError={handleError}
            isModal={true}
            redirect={true}
            setError={setErrorMessage}
          />
        </Box>
      </Modal>
      <CustomSnackbar
        autoHideDuration={3000}
        open={!!message || !!errorMessage}
        onClose={() => {
          setMessage(null);
          setErrorMessage(null);
        }}
        severity={errorMessage ? 'error' : 'success'}
        text={message || errorMessage}
      />
      <Box sx={cardInnerWrapper} className={'project-inner'}>
        <Tooltip
          title={project.name || project.project_name}
          arrow
          placement={'top'}
        >
          <Typography variant={'h5'} textAlign={'center'} sx={projectNameSx}>
            {project.name || project.project_name}
          </Typography>
        </Tooltip>
        <Tooltip
          title={project?.tags?.map(el => el).join(', ') ?? ''}
          arrow
          placement={'top'}
        >
          <Typography sx={categorySx}>
            {project?.tags?.map(el => el).join(', ') ?? ''}
          </Typography>
        </Tooltip>
        <Box sx={priceWrapper}>
          <Box sx={infoWrapper}>
            <Currency />
            <Typography>{project.price}</Typography>
          </Box>
          <Box sx={infoWrapper}>
            <Star />
            <Typography>150</Typography>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: 'auto',
          marginBottom: 0,
        }}
      >
        {!isPublic &&
          (currentRole === AUDITOR ? (
            <Box sx={statusWrapper}>
              {project.status !== SUBMITED && (
                <>
                  {project.status.toLowerCase() === RESOLVED.toLowerCase() ? (
                    <Box sx={{ backgroundColor: '#52176D' }} />
                  ) : (
                    project.status.toLowerCase() ===
                      WAITING_FOR_AUDITS.toLowerCase() && (
                      <Box sx={{ backgroundColor: '#FF9900' }} />
                    )
                  )}
                  {project.status.toLowerCase() !==
                    WAITING_FOR_AUDITS.toLowerCase() &&
                    project.status.toLowerCase() !== RESOLVED.toLowerCase() && (
                      <Box sx={{ backgroundColor: '#09C010' }} />
                    )}
                </>
              )}
              <Typography>{project.status}</Typography>
            </Box>
          ) : (
            <Box sx={statusWrapper}>
              {project.status === DONE ? (
                <Box sx={{ backgroundColor: '#FF4444' }} />
              ) : project.publish_options.publish ? (
                <Box sx={{ backgroundColor: '#09C010' }} />
              ) : (
                <Box sx={{ backgroundColor: '#FF9900' }} />
              )}
              <Typography>
                {project.status === DONE
                  ? 'Project closed'
                  : project.publish_options.publish
                  ? 'Published'
                  : 'Hidden'}
              </Typography>
            </Box>
          ))}
        {!isPublic ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '15px',
            }}
          >
            {type === AUDITOR &&
              project?.status?.toLowerCase() === RESOLVED.toLowerCase() && (
                <FormControlLabel
                  sx={switchStyle}
                  control={
                    <Switch
                      checked={project?.isPublic}
                      onChange={handlePublish}
                      name="public"
                      size={'small'}
                    />
                  }
                  label="Make it public"
                />
              )}
            <Button
              variant={'contained'}
              sx={[editButton, type === 'auditor' ? editAuditor : {}]}
              onClick={handleClick}
              {...addTestsLabel(
                type === AUDITOR ? 'submit-button' : 'edit-button',
              )}
            >
              {type === AUDITOR
                ? project?.status.toLowerCase() !==
                    WAITING_FOR_AUDITS.toLowerCase() &&
                  project?.status.toLowerCase() !== RESOLVED.toLowerCase()
                  ? 'Proceed'
                  : 'View'
                : 'Edit'}
            </Button>
          </Box>
        ) : (
          <Button
            variant={'contained'}
            sx={[editButton, type === 'auditor' ? editAuditor : {}]}
            onClick={handleView}
            {...addTestsLabel(
              type === AUDITOR ? 'submit-button' : 'edit-button',
            )}
          >
            View
          </Button>
        )}
        {!isPublic &&
          (type !== AUDITOR ? (
            <Box sx={smallButtonsBox}>
              <Button
                sx={copyBtn}
                onClick={handleMakeCopy}
                {...addTestsLabel('make-copy-button')}
              >
                Make a copy
              </Button>
              {project.publish_options.publish && (
                <ShareProjectButton projectId={project.id} />
              )}
            </Box>
          ) : (
            project?.status.toLowerCase() ===
              WAITING_FOR_AUDITS.toLowerCase() && (
              <Button
                sx={[editButton, { marginTop: '12px' }]}
                variant={'contained'}
                color={'primary'}
                onClick={handleStartAudit}
                {...addTestsLabel('make-copy-button')}
              >
                Start audit
              </Button>
            )
          ))}
      </Box>
    </Box>
  );
};

export default ProjectCard;

const switchStyle = theme => ({
  '.MuiTypography-root': {
    fontSize: '15px',
    fontWeight: 500,
  },
  [theme.breakpoints.down('sm')]: {
    '.MuiTypography-root': {
      fontSize: '12px',
    },
  },
  [theme.breakpoints.down('xs')]: {
    marginRight: 0,
    marginLeft: '-6px',
    '.MuiTypography-root': {
      fontSize: '10px',
    },
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

const priceWrapper = theme => ({
  display: 'flex',
  gap: '30px',
  mt: '18px',
  [theme.breakpoints.down('md')]: {
    gap: '18px',
  },
  [theme.breakpoints.down('xs')]: {
    mt: '5px',
  },
});

const projectNameSx = theme => ({
  height: '45px',
  overflow: 'hidden',
  wordBreak: 'break-word',
  '-webkit-line-clamp': '2',
  '-webkit-box-orient': 'vertical',
  'text-overflow': 'ellipsis',
  display: '-webkit-box',
});

const cardInnerWrapper = theme => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  [theme.breakpoints.down('xs')]: {
    alignItems: 'flex-start',
  },
});

const smallButtonsBox = theme => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  minWidth: '100px',
  height: '60px',
  mt: '12px',
  [theme.breakpoints.down('xs')]: {
    mt: '5px',
    height: '52px',
    justifyContent: 'flex-start',
  },
});

const copyBtn = theme => ({
  textTransform: 'none',
  fontSize: '10px',
  mt: '12px',
  [theme.breakpoints.down('xs')]: {
    padding: '4px 6px',
  },
});

const statusWrapper = theme => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '15px',
  width: '100%',
  '& p': {
    fontSize: '10px',
    fontWeight: 500,
    color: '#434242',
  },
  '& div': {
    width: '17px',
    height: '17px',
    borderRadius: '50%',
  },
  margin: '40px 0 18px',
  [theme.breakpoints.down('md')]: {
    margin: '25px 0 10px',
  },
  [theme.breakpoints.down('xs')]: {
    marginTop: 0,
    gap: '10px',
    '& div': {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
    },
  },
});

const editButton = theme => ({
  fontSize: '15px',
  fontWeight: 600,
  lineHeight: '25px',
  width: '100px',
  textTransform: 'none',
  borderRadius: '10px',
  gap: '40px',
  padding: '9px 0',
  maxWidth: '170px',
  [theme.breakpoints.down('md')]: {
    height: '30px',
  },
  [theme.breakpoints.down('xs')]: {
    fontSize: '11px',
  },
});

const editAuditor = theme => ({
  backgroundColor: theme.palette.secondary.main,
  '&:hover': {
    backgroundColor: '#450e5d',
  },
});

const infoWrapper = theme => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  '& p': {
    fontSize: '12px!important',
    marginLeft: '8px',
  },
  [theme.breakpoints.down('xs')]: {
    '& p': {
      fontSize: '10px!important',
    },
    '& svg': {
      width: '10px',
      height: '10px',
    },
  },
});

const categorySx = theme => ({
  textAlign: 'center',
  height: '55px',
  overflow: 'hidden',
  '-webkit-line-clamp': '3',
  '-webkit-box-orient': 'vertical',
  'text-overflow': 'ellipsis',
  display: '-webkit-box',
  fontSize: '12px!important',
  fontWeight: 500,
  color: '#434242',
  margin: '10px 0 7px',
  [theme.breakpoints.down('xs')]: {
    fontSize: '10px!important',
    textAlign: 'left',
    height: '40px',
  },
});

const cardWrapper = theme => ({
  display: 'flex',
  flexDirection: 'column',
  padding: '24px 30px 24px',
  height: '100%',
  boxShadow:
    '0px 64.1377px 76.5824px rgba(0, 0, 0, 0.07),' +
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
    lineHeight: '22px',
  },
  [theme.breakpoints.down('md')]: {
    padding: '24px 22px 24px',
  },
  [theme.breakpoints.down('xs')]: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: '40px',
    padding: '15px 20px',
    '& h5': {
      fontSize: '14px',
      fontWeight: 500,
    },
  },
  [theme.breakpoints.down(420)]: {
    gap: '10px',
  },
});
