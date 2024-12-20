import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Box, Button, Tooltip } from '@mui/material';
import { addTestsLabel } from '../../lib/helper.js';
import { AUDITOR, CUSTOMER } from '../../redux/actions/types.js';
import theme from '../../styles/themes.js';
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
import HelpOutlineIcon from '@mui/icons-material/HelpOutline.js';

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
          { action: NOT_FIXED_ACTION, text: 'Reopen' },
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
    <Box sx={wrapper}>
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
              statusBtn(theme, user.current_role === CUSTOMER),
            ]}
            onClick={() => handleChangeStatus(action.action)}
            {...addTestsLabel('change-status-button')}
          >
            {action.text}
          </Button>
        );
      })}
      {status === 'Draft' && (
        <Tooltip
          title="The project creator will be able to see the issue"
          placement="top"
          enterTouchDelay={0}
          leaveTouchDelay={4000}
        >
          <Button color="secondary" sx={helpButtonSx}>
            <HelpOutlineIcon sx={{ fontSize: '18px' }} cursor="pointer" />
          </Button>
        </Tooltip>
      )}
    </Box>
  );
};

export default StatusControl;

const statusBtn = (theme, isCustomer) => ({
  width: '100px',
  padding: '2px 0!important',
  fontSize: '14px',
  [theme.breakpoints.down('md')]: {
    fontSize: '14px!important',
    width: isCustomer ? '100px' : '80px',
  },
  [theme.breakpoints.down(650)]: {
    fontSize: '12px!important',
  },
});

const wrapper = {
  display: 'flex',
  gap: '8px',
  alignItems: 'center',
};

const helpButtonSx = theme => ({
  minWidth: '20px',
  textTransform: 'none',
  padding: '4px 6px',
  [theme.breakpoints.down(600)]: {
    padding: 0,
  },
});
