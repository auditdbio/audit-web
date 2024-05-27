import React, { useEffect, useState } from 'react';
import { Box, Button, Modal, Typography } from '@mui/material';
import DescriptionModal from './DescriptionModal.jsx';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAuditHistory,
  getAuditRequestHistory,
} from '../../redux/actions/auditAction.js';

const HistoryDescription = ({ audit, request }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const auditHistory = useSelector(s => s.audits.auditHistory);
  const auditRequestHistory = useSelector(s => s.audits.auditRequestHistory);

  useEffect(() => {
    if (request) {
      dispatch(getAuditRequestHistory(audit?.id));
    } else {
      dispatch(getAuditHistory(audit?.id));
    }
  }, [audit]);

  return (
    <Box>
      <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={modalStyle}>
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
            <Box sx={{ margin: '15px', height: '100%', overflow: 'auto' }}>
              <Box>
                {(request ? auditRequestHistory : auditHistory)?.map(
                  (item, index, arr) => {
                    if (index < arr.length - 1) {
                      return (
                        <React.Fragment key={item.id}>
                          <DescriptionModal
                            oldValue={arr[index + 1]}
                            item={item}
                            request={request}
                          />
                        </React.Fragment>
                      );
                    }
                    return null;
                  },
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </Modal>
      <Button
        sx={{ marginY: '15px', textTransform: 'unset' }}
        variant={'contained'}
        onClick={() => setIsOpen(true)}
        disabled={(request ? auditRequestHistory : auditHistory)?.length === 0}
      >
        Show history
      </Button>
    </Box>
  );
};

export default HistoryDescription;

const titleSx = theme => ({
  marginLeft: '15px',
  fontWeight: 500,
  fontSize: '28px',
  [theme.breakpoints.down('md')]: {
    fontSize: '24px',
  },
});

const modalStyle = theme => ({
  position: 'absolute',
  width: '80%',
  p: 2,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  height: '80%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  [theme.breakpoints.down('sm')]: {
    width: '95%',
    height: '95%',
  },
});

const modalSx = theme => ({
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: '10px',
  height: 'auto',
  maxHeight: '100%',
  width: '100%',
  // overflow: 'auto',
  display: 'flex',
  flexDirection: 'column',
});
