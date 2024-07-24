import React, { useEffect, useMemo, useState } from 'react';
import { Box, Button, Modal, Typography, useMediaQuery } from '@mui/material';
import DescriptionModal from './DescriptionModal.jsx';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAuditHistory,
  getAuditRequestHistory,
} from '../../redux/actions/auditAction.js';
import Badge from '@mui/material/Badge';
import { CUSTOMER } from '../../redux/actions/types.js';
import CustomSnackbar from '../custom/CustomSnackbar.jsx';

const HistoryDescription = ({ audit, request }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const auditHistory = useSelector(s => s.audits.auditHistory);
  const auditRequestHistory = useSelector(s => s.audits.auditRequestHistory);
  const matchSx = useMediaQuery(theme => theme.breakpoints.down('xs'));
  const approvedChange = useSelector(s => s.audits.approvedHistory);
  const unread = useSelector(s => s.audits.unreadHistory);
  const user = useSelector(s => s.user.user);
  const [showRecap, setShowRecap] = useState(false);
  const [showChanges, setShowChanges] = useState(false);

  useEffect(() => {
    if (request) {
      dispatch(getAuditRequestHistory(audit?.id));
    } else {
      dispatch(getAuditHistory(audit?.id));
    }
  }, [audit]);

  useEffect(() => {
    if (
      !!unread &&
      unread[user?.id] > 0 &&
      unread[user?.id] !== 0 &&
      !request
    ) {
      setShowRecap(true);
    }
  }, [auditHistory, auditRequestHistory]);

  const handleOpenRecap = () => {
    setShowRecap(false);
    setIsOpen(true);
    setShowChanges(true);
  };

  const handleCloseRecap = () => {
    setShowRecap(false);
    setShowChanges(false);
    setIsOpen(false);
  };

  const arrData = useMemo(() => {
    return request ? auditRequestHistory : auditHistory;
  }, [request, auditHistory, auditRequestHistory]);

  return (
    <Box>
      <CustomSnackbar
        open={showRecap}
        action={handleOpenRecap}
        buttonText={'Open'}
        autoHideDuration={50000}
        onClose={() => setShowRecap(false)}
        text="You have modifications awaiting your approval."
      />
      {isOpen && (
        <Box sx={modalStyle}>
          <Modal
            open={isOpen}
            onClose={() => setIsOpen(false)}
            aria-labelledby="parent-modal-title"
            aria-describedby="parent-modal-description"
          >
            <Box sx={modalSx}>
              <Button
                sx={{
                  minWidth: 'unset',
                  position: 'sticky',
                  top: '-20px',
                  alignSelf: 'flex-start',
                }}
                onClick={() => setIsOpen(false)}
              >
                <CloseRoundedIcon />
              </Button>
              <Typography variant={'h4'} sx={titleSx}>
                History of changes
              </Typography>
              <Box
                sx={{
                  height: '100%',
                  marginRight: '-6px',
                  marginTop: '10px',
                  overflow: 'auto',
                }}
              >
                {approvedChange && !matchSx && (
                  <Box
                    sx={{
                      display: 'flex',
                      // justifyContent: 'space-between',
                      paddingX: '12px',
                    }}
                  >
                    <Typography variant={'h4'} sx={listHeaderSx}>
                      User
                    </Typography>
                    <Box sx={listWrapperSx}>
                      <Typography
                        variant={'h4'}
                        sx={{ fontSize: '20px', fontWeight: 600 }}
                      >
                        Approve
                      </Typography>
                      <Typography variant={'h4'} sx={dateTitleSx}>
                        Date
                      </Typography>
                    </Box>
                  </Box>
                )}
                <Box>
                  {arrData?.map((item, index, arr) => {
                    if (index < arr.length - 1) {
                      return (
                        <React.Fragment key={item.id}>
                          <DescriptionModal
                            oldValue={arr[index + 1]}
                            item={item}
                            request={request}
                            idx={index}
                          />
                        </React.Fragment>
                      );
                    }
                    return null;
                  })}
                </Box>
              </Box>
            </Box>
          </Modal>
        </Box>
      )}
      {showChanges && (
        <DescriptionModal
          oldValue={arrData[unread[user?.id]]}
          item={arrData[0]}
          request={request}
          idx={0}
          openDiff={func => func(true)}
          handleCloseRecap={handleCloseRecap}
          closeChangesRecap={setShowChanges}
        />
      )}
      {unread && unread[user?.id] > 0 ? (
        <Badge
          color={'secondary'}
          badgeContent="new"
          sx={{
            '& .MuiBadge-badge': {
              top: '16px',
            },
          }}
        >
          <Button
            sx={{ marginY: '15px', textTransform: 'unset' }}
            variant={'contained'}
            onClick={() => setIsOpen(true)}
            disabled={
              (request ? auditRequestHistory : auditHistory)?.length <= 1
            }
          >
            Show history
          </Button>
        </Badge>
      ) : (
        <Button
          sx={{ marginY: '15px', textTransform: 'unset' }}
          variant={'contained'}
          onClick={() => setIsOpen(true)}
          disabled={(request ? auditRequestHistory : auditHistory)?.length <= 1}
        >
          Show history
        </Button>
      )}
    </Box>
  );
};

export default HistoryDescription;

const dateTitleSx = theme => ({
  fontSize: '20px',
  fontWeight: 600,
  marginLeft: '225px',
  [theme.breakpoints.down('md')]: {
    marginLeft: '184px',
  },
  [theme.breakpoints.down('sm')]: {
    marginLeft: '154px',
  },
});

const listWrapperSx = theme => ({
  display: 'flex',
  width: '450px',
  [theme.breakpoints.down('sm')]: {
    width: '370px',
  },
});

const listHeaderSx = theme => ({
  fontSize: '20px',
  fontWeight: 600,
  width: 'calc(100% - 454px)',
  [theme.breakpoints.down('md')]: {
    width: 'calc(100% - 355px)',
  },
  [theme.breakpoints.down('sm')]: {
    width: 'calc(100% - 330px)',
  },
});

const titleSx = theme => ({
  marginLeft: '15px',
  fontWeight: 500,
  fontSize: '28px',
  mt: '12px',
  [theme.breakpoints.down('md')]: {
    fontSize: '24px',
  },
});

const modalStyle = theme => ({
  width: '95%',
  p: 2,

  height: '80%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  [theme.breakpoints.down('sm')]: {
    height: '95%',
  },
});

const modalSx = theme => ({
  bgcolor: 'background.paper',
  boxShadow: 24,
  top: '50%',
  left: '50%',
  position: 'absolute',
  transform: 'translate(-50%, -50%)',
  paddingRight: '12px',
  borderRadius: '10px',
  height: 'auto',
  maxHeight: '80%',
  width: '95%',
  // overflow: 'auto',
  display: 'flex',
  flexDirection: 'column',
});