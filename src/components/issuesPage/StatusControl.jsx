import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Box, Button } from '@mui/material';
import { addTestsLabel } from '../../lib/helper.js';
import { AUDITOR, CUSTOMER } from '../../redux/actions/types.js';
import {
  BEGIN_ACTION,
  DISCARD_ACTION,
  DRAFT,
  FIXED,
  FIXED_ACTION,
  IN_PROGRESS,
  NOT_FIXED,
  NOT_FIXED_ACTION,
  REOPEN_ACTION,
  VERIFICATION,
  VERIFIED_ACTION,
} from './constants.js';

const StatusControl = ({ status, setFieldValue }) => {
  const { user } = useSelector(s => s.user);
  const [statusActions, setStatusActions] = useState([]);

  useEffect(() => {
    const actions = [];
    if (user?.current_role === AUDITOR) {
      if (status === DRAFT) {
        actions.push({ action: BEGIN_ACTION, text: 'Disclose' });
      }
      if (status === IN_PROGRESS) {
        actions.push({ action: DISCARD_ACTION, text: 'Not Fixed' });
      }
      if (status === VERIFICATION) {
        actions.push(
          { action: VERIFIED_ACTION, text: 'Verified' },
          { action: NOT_FIXED_ACTION, text: 'Not Fixed' },
        );
      }
      if (status === FIXED) {
        actions.push({ action: VERIFIED_ACTION, text: 'Not Fixed' });
      }
      if (status === NOT_FIXED) {
        actions.push({ action: REOPEN_ACTION, text: 'Reopen' });
      }
    } else if (user?.current_role === CUSTOMER) {
      if (status === IN_PROGRESS) {
        actions.push(
          { action: FIXED_ACTION, text: 'Fixed' },
          { action: DISCARD_ACTION, text: 'Discard' },
        );
      }
      if (status === NOT_FIXED) {
        actions.push({ action: REOPEN_ACTION, text: 'In Progress' });
      }
      if (status === VERIFICATION) {
        actions.push({ action: FIXED_ACTION, text: 'In Progress' });
      }
    }

    setStatusActions(() => actions);
  }, [status]);

  const handleChangeStatus = action => {
    setFieldValue('status', action);
  };

  return (
    <Box sx={wrapper}>
      {statusActions.map(action => {
        return (
          <Button
            key={action.action}
            variant="contained"
            type="submit"
            color={user.current_role !== CUSTOMER ? 'secondary' : 'primary'}
            sx={{ textTransform: 'none', mb: '10px' }}
            onClick={() => handleChangeStatus(action.action)}
            {...addTestsLabel('change-status-button')}
          >
            {action.text}
          </Button>
        );
      })}
    </Box>
  );
};

export default StatusControl;

const wrapper = {
  display: 'flex',
  flexDirection: 'column',
};
