import React, { useEffect, useState } from 'react';
import { Box, Button, Modal, Typography } from '@mui/material';
import AuditRequestInfo from '../audit-request-info.jsx';
import { useDispatch, useSelector } from 'react-redux';
import {
  acceptAudit,
  confirmAudit,
  deleteAuditRequest,
  getAuditRequest,
} from '../../redux/actions/auditAction.js';
import { AUDITOR, CLEAR_AUDIT_REQUEST } from '../../redux/actions/types.js';
import { LoadingButton } from '@mui/lab';
import { isAuth } from '../../lib/helper.js';
import {
  changeRolePublicAuditor,
  changeRolePublicAuditorNoRedirect,
} from '../../redux/actions/userAction.js';
import OfferModal from '../modal/OfferModal.jsx';
import dayjs from 'dayjs';
import ConfirmModal from '../modal/ConfirmModal.jsx';

const AuditMessage = ({ message, handleError, navigate }) => {
  const user = useSelector(state => state.user.user);
  const [open, setOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const data = JSON.parse(message.text);
  const auditInfo = useSelector(s => s.audits?.auditRequest);
  const dispatch = useDispatch();
  const { auditor } = useSelector(s => s.auditor);
  const [confirmDeclineOpen, setConfirmDeclineOpen] = useState(false);
  const auditRequest = useSelector(s => s.audits?.auditRequest);

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
  //

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
  console.log(JSON.parse(message.text));
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <Typography align={'center'}>Audit request</Typography>
      <Typography align={'center'}>{data.project_name}</Typography>
      <Box
        sx={{
          display: 'flex',
          gap: '10px',
          justifyContent: 'space-between',
        }}
      >
        <Typography sx={{ fontSize: '14px!important', padding: '0!important' }}>
          ${data.price} per line
        </Typography>
        <Typography
          sx={{ fontSize: '14px!important', padding: '0!important' }}
          align={'center'}
        >
          {dayjs(data?.time?.to).format('DD.MMM.YYYY')}
        </Typography>
      </Box>
      {message.from?.id !== user.id && (
        <>
          <Box sx={{ display: 'flex', gap: '20px' }}>
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
              color={user.current_role === AUDITOR ? 'primary' : 'secondary'}
              onClick={() => setConfirmDeclineOpen(true)}
            >
              Decline
            </Button>
          </Box>
          {user.current_role === AUDITOR && (
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
