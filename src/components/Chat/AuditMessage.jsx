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
import AuditInfo from '../../pages/audit-info.jsx';

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

  const handleViewCustomer = () => {
    localStorage.setItem('prevPath', window.location.pathname);
    navigate(`/audit-info/${data.id}/customer`);
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
    dispatch(confirmAudit(data));
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
              {data.status?.toLowerCase() === RESOLVED.toLowerCase() ? (
                <Box sx={{ backgroundColor: '#52176D' }} />
              ) : (
                data.status?.toLowerCase() ===
                  WAITING_FOR_AUDITS.toLowerCase() && (
                  <Box sx={{ backgroundColor: '#FF9900' }} />
                )
              )}
              {data.status?.toLowerCase() !== RESOLVED.toLowerCase() &&
                data.status?.toLowerCase() !==
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
      {data.status?.toLowerCase() === WAITING_FOR_AUDITS.toLowerCase() &&
        user.current_role === CUSTOMER &&
        message.from?.id === user.id && (
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
      {data.status?.toLowerCase() === WAITING_FOR_AUDITS.toLowerCase() &&
        user.current_role === AUDITOR && (
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
        )}
      {data.status === 'Request' &&
        user.current_role === CUSTOMER &&
        message.from?.id !== user.id && (
          <Box sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', gap: '20px' }}>
              <Button
                sx={{ textTransform: 'unset', width: '100%' }}
                variant={'contained'}
                onClick={() => handleConfirm(data)}
              >
                Accept
              </Button>
              <Button
                sx={{ textTransform: 'unset', width: '100%' }}
                variant={'contained'}
                color={user.current_role === AUDITOR ? 'primary' : 'secondary'}
                onClick={() => setConfirmDeclineOpen(true)}
              >
                Decline
              </Button>
            </Box>
            <Box sx={{ mt: '15px' }}>
              <Button
                sx={{ textTransform: 'unset', width: '100%' }}
                variant={'contained'}
                onClick={() => {
                  handleOpen();
                }}
              >
                View
              </Button>
            </Box>
          </Box>
        )}

      {user.current_role === AUDITOR &&
        data.status === 'Request' &&
        message.from?.id !== user.id && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <Box sx={{ display: 'flex', gap: '20px' }}>
              <Button
                sx={{ textTransform: 'unset', width: '100%' }}
                variant={'contained'}
                disabled={
                  user.current_role === AUDITOR &&
                  data.last_changer?.toLowerCase() !== CUSTOMER
                }
                onClick={() => handleConfirm(data)}
              >
                Accept
              </Button>
              <Button
                sx={{ textTransform: 'unset', width: '100%' }}
                variant={'contained'}
                color={user.current_role === AUDITOR ? 'primary' : 'secondary'}
                onClick={() => setConfirmDeclineOpen(true)}
              >
                Decline
              </Button>
            </Box>
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
                loading={isOpen && !auditRequest?.info}
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
            </Box>
          </Box>
        )}
      <Modal
        open={isOpen && auditRequest?.id && user.current_role === AUDITOR}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalSx}>
          <AuditRequestInfo
            project={auditRequest}
            onClose={() => setIsOpen(false)}
            stayHere={true}
          />
        </Box>
      </Modal>
      <Modal
        open={isOpen && auditRequest?.id && user.current_role === CUSTOMER}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalSx}>
          <AuditInfo
            audit={auditRequest}
            handleClose={handleClose}
            auditRequest={auditRequest}
          />
        </Box>
      </Modal>
      {/*<AuditInfo audit={auditRequest} auditRequest={auditRequest} />*/}
      {user.current_role === CUSTOMER &&
        data.status === 'Request' &&
        message.from?.id === user.id && (
          <Box sx={{ mt: '15px' }}>
            <Button
              sx={{ textTransform: 'unset', width: '100%' }}
              variant={'contained'}
              onClick={() => {
                handleOpen();
              }}
            >
              View
            </Button>
          </Box>
        )}
      {user.current_role === AUDITOR &&
        data.status === 'Request' &&
        message.from?.id === user.id && (
          <Box sx={{ mt: '15px' }}>
            <Button
              sx={{ textTransform: 'unset', width: '100%' }}
              variant={'contained'}
              color={'secondary'}
              onClick={handleOpen}
            >
              View
            </Button>
          </Box>
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
        {user.current_role === CUSTOMER && data.status === 'Started' && (
          <Box sx={{ display: 'flex', gap: '20px' }}>
            <Button
              sx={{ textTransform: 'unset', width: '100%' }}
              variant="contained"
              onClick={handleViewCustomer}
            >
              View
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
  width: 1000,
  maxHeight: '80%',
  // height: '100%',
  overflowY: 'auto',
  bgcolor: 'background.paper',
  // boxShadow: 24,
  borderRadius: '10px',
  // height: '100%',
  '& .audit-info-wrapper': {
    // overflowY: 'auto',
    // height: '100%',
    padding: '20px',
    borderRight: 'unset',
    borderRadius: '10px',
  },
  '& .audit-request-wrapper': {
    // overflowY: 'auto',
    // height: '100%',
    padding: '20px',
    borderRight: 'unset',
    borderRadius: '10px',
  },
  // [theme.breakpoints.down('lg')]: {
  //   maxHeight: '600px',
  // },
  [theme.breakpoints.down('md')]: {
    maxWidth: 700,
    // maxHeight: '450px',
    width: 'unset',
  },
  // [theme.breakpoints.down('sm')]: {
  //   maxHeight: '300px',
  // },
  [theme.breakpoints.down('xs')]: {
    maxWidth: '95%',
    width: '100%',
    // maxHeight: '80%',
  },
});
