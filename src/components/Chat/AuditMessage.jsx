import React, { useEffect, useState } from 'react';
import { Box, Button, Modal, Typography } from '@mui/material';
import AuditRequestInfo from '../audit-request-info.jsx';
import { useDispatch, useSelector } from 'react-redux';
import {
  acceptAudit,
  confirmAudit,
  deleteAuditRequest,
  getAuditRequest,
  startAudit,
} from '../../redux/actions/auditAction.js';
import {
  AUDITOR,
  CLEAR_AUDIT_REQUEST,
  CUSTOMER,
  RESOLVED,
  WAITING_FOR_AUDITS,
} from '../../redux/actions/types.js';
import { LoadingButton } from '@mui/lab';
import { isAuth } from '../../lib/helper.js';
import {
  changeRolePublicAuditor,
  changeRolePublicAuditorNoRedirect,
} from '../../redux/actions/userAction.js';
import OfferModal from '../modal/OfferModal.jsx';
import dayjs from 'dayjs';
import ConfirmModal from '../modal/ConfirmModal.jsx';
import { useNavigate } from 'react-router-dom/dist';

const AuditMessage = ({ message, handleError }) => {
  const user = useSelector(state => state.user.user);
  const [open, setOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const data = JSON.parse(message.text);
  const auditInfo = useSelector(s => s.audits?.auditRequest);
  const dispatch = useDispatch();
  const { auditor } = useSelector(s => s.auditor);
  const [confirmDeclineOpen, setConfirmDeclineOpen] = useState(false);
  const auditRequest = useSelector(s => s.audits?.auditRequest);
  const navigate = useNavigate();

  const handleDecline = () => {
    setConfirmDeclineOpen(false);
    dispatch(deleteAuditRequest(data.id, true));
  };

  const handleOpen = () => {
    dispatch(getAuditRequest(data.id));
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    dispatch({ type: CLEAR_AUDIT_REQUEST });
  };

  const handleView = () => {
    localStorage.setItem('prevPath', window.location.pathname);
    navigate(`/audit-info/${data.id}/auditor`);
  };

  const handleOpenModal = () => {
    if (user.current_role === AUDITOR && isAuth() && auditor?.first_name) {
      setOpen(true);
    } else if (
      user.current_role !== AUDITOR &&
      isAuth() &&
      !auditor?.first_name
    ) {
      dispatch(changeRolePublicAuditorNoRedirect(AUDITOR, user.id, auditor));
      handleError();
      setOpen(true);
    } else if (
      !auditor?.first_name &&
      user.current_role === AUDITOR &&
      isAuth()
    ) {
      dispatch(changeRolePublicAuditor(AUDITOR, user.id, auditor));
    } else if (
      user.current_role !== AUDITOR &&
      isAuth() &&
      !auditor?.first_name
    ) {
      dispatch(changeRolePublicAuditor(AUDITOR, user.id, auditor));
      handleError();
      setOpen(true);
    } else {
      navigate('/sign-in');
    }
  };

  const handleConfirm = () => {
    dispatch(confirmAudit(data, true));
  };

  // useEffect(() => {
  //   dispatch(getAuditRequest(data.id));
  //   return () => {
  //     dispatch({ type: CLEAR_AUDIT_REQUEST });
  //   };
  // }, [data.id]);
  //

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <Typography align={'center'}>Audit request</Typography>
      <Typography align={'center'}>{data.project_name}</Typography>
      {data.status === 'Declined' ? (
        <Box sx={statusWrapper}>
          <Box sx={{ backgroundColor: '#ff0026' }} />
          <Typography align={'center'} sx={{ color: 'red!important' }}>
            {data.status}
          </Typography>
        </Box>
      ) : (
        <>
          <Box
            sx={{
              display: 'flex',
              gap: '10px',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography
              sx={{ fontSize: '14px!important', padding: '0!important' }}
            >
              ${data.price} per line
            </Typography>
            <Box>
              <Typography
                sx={{ fontSize: '14px!important', padding: '0!important' }}
                align={'center'}
              >
                {dayjs(data?.time?.from).format('DD MMM YYYY')}
              </Typography>
              <Typography
                sx={{
                  fontSize: '14px!important',
                  marginBottom: '5px',
                  padding: '0!important',
                }}
                align={'center'}
              >
                {dayjs(data?.time?.to).format('DD MMM YYYY')}
              </Typography>
            </Box>
          </Box>
          <Box sx={statusWrapper}>
            <>
              {data.status.toLowerCase() === RESOLVED.toLowerCase() ? (
                <Box sx={{ backgroundColor: '#52176D' }} />
              ) : (
                data.status.toLowerCase() ===
                  WAITING_FOR_AUDITS.toLowerCase() && (
                  <Box sx={{ backgroundColor: '#FF9900' }} />
                )
              )}
              {data.status.toLowerCase() !== RESOLVED.toLowerCase() &&
                data.status.toLowerCase() !==
                  WAITING_FOR_AUDITS.toLowerCase() && (
                  <Box sx={{ backgroundColor: '#09C010' }} />
                )}
            </>{' '}
            <Typography align={'center'} sx={{ color: '#52176D!important' }}>
              {data.status}
            </Typography>
          </Box>
        </>
      )}
      {data.status.toLowerCase() === WAITING_FOR_AUDITS.toLowerCase() &&
        user.current_role === CUSTOMER && (
          <Button
            sx={{ textTransform: 'unset', width: '100%' }}
            variant={'contained'}
            onClick={() => {
              localStorage.setItem('prevPath', window.location.pathname);
              navigate(`/audit-info/${data.id}/customer`);
            }}
          >
            View
          </Button>
        )}
      {data.status !== 'Declined' && message.from?.id !== user.id && (
        <>
          {data.status === 'Waiting for audit' ? (
            <Box sx={{ display: 'flex', gap: '20px' }}>
              <Button
                sx={{ textTransform: 'unset', width: '100%' }}
                variant="contained"
                color="secondary"
                onClick={() => {
                  localStorage.setItem('prevPath', window.location.pathname);
                  dispatch(startAudit(data));
                }}
              >
                Start audit
              </Button>
              <Button
                onClick={handleView}
                sx={{ textTransform: 'unset', width: '100%' }}
                variant="contained"
                color="primary"
              >
                View
              </Button>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', gap: '20px' }}>
              {data.status === 'Request' ? (
                <>
                  <Button
                    sx={{ textTransform: 'unset', width: '100%' }}
                    variant={'contained'}
                    onClick={() =>
                      user.current_role !== AUDITOR && handleConfirm(data)
                    }
                  >
                    Accept
                  </Button>
                  <Button
                    sx={{ textTransform: 'unset', width: '100%' }}
                    variant={'contained'}
                    color={
                      user.current_role === AUDITOR ? 'primary' : 'secondary'
                    }
                    onClick={() => setConfirmDeclineOpen(true)}
                  >
                    Decline
                  </Button>
                </>
              ) : (
                <>
                  {user.current_role !== AUDITOR && (
                    <Button
                      sx={{ textTransform: 'unset', width: '100%' }}
                      variant={'contained'}
                      onClick={() => {
                        localStorage.setItem(
                          'prevPath',
                          window.location.pathname,
                        );
                        navigate(`/audit-info/${data.id}/customer`);
                      }}
                    >
                      View
                    </Button>
                  )}
                </>
              )}
            </Box>
          )}
          {user.current_role === AUDITOR &&
            data.status !== 'Waiting for audit' && (
              <Box sx={{ display: 'flex', gap: '20px' }}>
                <Button
                  sx={{
                    textTransform: 'unset',
                    width: '100%',
                  }}
                  onClick={handleOpenModal}
                  color={'secondary'}
                  variant={'contained'}
                >
                  Make offer
                </Button>
                <LoadingButton
                  loading={isOpen && !auditInfo?.info}
                  // loadingPosition="start"
                  sx={{
                    textTransform: 'unset',
                    width: '100%',
                  }}
                  onClick={handleOpen}
                  color={'secondary'}
                  variant={'contained'}
                >
                  View more
                </LoadingButton>
                <Modal
                  open={isOpen && auditInfo?.id}
                  onClose={handleClose}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box sx={modalSx}>
                    <AuditRequestInfo
                      project={auditInfo}
                      onClose={() => setIsOpen(false)}
                    />
                  </Box>
                </Modal>
              </Box>
            )}
        </>
      )}
      <>
        {user.current_role === AUDITOR && data.status === 'Started' && (
          <Box sx={{ display: 'flex', gap: '20px' }}>
            <Button
              sx={{ textTransform: 'unset', width: '100%' }}
              variant="contained"
              color="secondary"
              onClick={handleView}
            >
              Proceed
            </Button>
          </Box>
        )}
      </>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
        disableScrollLock
      >
        <OfferModal
          auditor={auditor}
          project={data}
          user={user}
          stayHere={true}
          handleClose={() => setOpen(false)}
        />
      </Modal>
      <ConfirmModal
        isOpen={confirmDeclineOpen}
        handleAgree={handleDecline}
        handleDisagree={() => setConfirmDeclineOpen(false)}
      />
    </Box>
  );
};

export default AuditMessage;

const statusWrapper = theme => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px',
  width: '100%',
  '& p': {
    fontSize: '14px!important',
    fontWeight: 500,
    padding: '0!important',
    [theme.breakpoints.down('sm')]: {
      fontSize: '12px!important',
    },
  },
  '& div': {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
  },
  margin: '0',
});

const modalSx = theme => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700,
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: '10px',
  [theme.breakpoints.down('xs')]: {
    width: 380,
  },
  [theme.breakpoints.down('xxs')]: {
    width: 310,
  },
});
