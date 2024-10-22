import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Box, Button, Tooltip } from '@mui/material';
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
  WILL_NOT_FIX,
} from './constants.js';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';

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
        actions.push(
          { action: DISCARD_ACTION, text: 'Discard' },
          { action: FIXED_ACTION, text: 'Fixed' },
        );
      }
      if (status === VERIFICATION) {
        actions.push(
          { action: VERIFIED_ACTION, text: 'Verified' },
          { action: NOT_FIXED_ACTION, text: 'Not Fixed' },
          { action: DISCARD_ACTION, text: 'Discard' },
        );
      }
      if (status === FIXED) {
        actions.push(
          { action: REOPEN_ACTION, text: 'Reopen' },
          { action: DISCARD_ACTION, text: 'Discard' },
          { action: NOT_FIXED_ACTION, text: 'Verify' },
        );
      }
      if (status === NOT_FIXED || status === WILL_NOT_FIX) {
        actions.push(
          { action: REOPEN_ACTION, text: 'Reopen' },
          { action: FIXED_ACTION, text: 'Fixed' },
          { action: VERIFIED_ACTION, text: 'Verify' },
        );
      }
    } else if (user?.current_role === CUSTOMER) {
      if (status === IN_PROGRESS) {
        actions.push(
          { action: FIXED_ACTION, text: 'Fixed' },
          { action: DISCARD_ACTION, text: 'Discard' },
        );
      }
      if (status === NOT_FIXED || status === WILL_NOT_FIX) {
        actions.push({ action: REOPEN_ACTION, text: 'In Progress' });
      }
      if (status === VERIFICATION) {
        actions.push(
          { action: NOT_FIXED_ACTION, text: 'In Progress' },
          { action: DISCARD_ACTION, text: 'Discard' },
        );
      }
    }

    setStatusActions(() => actions);
  }, [status]);

  const handleChangeStatus = action => {
    setFieldValue('status', action);
  };

  return (
    <Box
      sx={
        status !== 'Draft'
          ? wrapper
          : { display: 'flex', alignItems: 'center', gap: '7px' }
      }
    >
      {statusActions.map(action => {
        return (
          <Button
            key={action.action}
            variant="contained"
            type="submit"
            color={user.current_role !== CUSTOMER ? 'secondary' : 'primary'}
            sx={[
              status !== 'Draft'
                ? { textTransform: 'none' }
                : { textTransform: 'none' },
              statusBtn,
            ]}
            onClick={() => handleChangeStatus(action.action)}
            {...addTestsLabel('change-status-button')}
          >
            {action.text === 'Not Fixed' ? 'Will not fix' : action.text}
          </Button>
        );
      })}
      {status === 'Draft' && (
        <Tooltip
          title="The project creator will be able to see the issue"
          placement="top"
        >
          <Button
            color={'secondary'}
            sx={{ minWidth: '20px', textTransform: 'none', mb: '10px' }}
          >
            <QuestionMarkIcon />
          </Button>
        </Tooltip>
      )}
    </Box>
  );
};

export default StatusControl;

const statusBtn = theme => ({
  width: '100px',
  padding: '6px 0!important',
  fontSize: '16px',
  [theme.breakpoints.down('md')]: {
    fontSize: '14px!important',
  },
  [theme.breakpoints.down('sm')]: {
    width: '70px',
  },
});

const wrapper = {
  display: 'flex',
  // flexDirection: 'column',
  gap: '10px',
};
