import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Box, Button } from '@mui/material';
import { addTestsLabel } from '../../lib/helper.js';
import { AUDITOR, CUSTOMER } from '../../redux/actions/types.js';

const StatusControl = ({ status, setFieldValue }) => {
  const { user } = useSelector(s => s.user);
  const [statusActions, setStatusActions] = useState([]);

  useEffect(() => {
    const actions = [];
    if (user?.current_role === AUDITOR) {
      if (status === 'Draft') {
        actions.push({ action: 'Begin', text: 'Disclose' });
      }
      if (status === 'Verification') {
        actions.push(
          { action: 'Verified', text: 'Verified' },
          { action: 'NotFixed', text: 'Not Fixed' },
        );
      }
      if (status === 'Fixed') {
        actions.push({ action: 'Verified', text: 'Not Fixed' });
      }
    } else if (user?.current_role === CUSTOMER) {
      if (status === 'InProgress') {
        actions.push(
          { action: 'Fixed', text: 'Fixed' },
          { action: 'Discard', text: 'Discard' },
        );
      }
      if (status === 'WillNotFix') {
        actions.push({ action: 'Discard', text: 'In Progress' });
      }
      if (status === 'Verification') {
        actions.push({ action: 'Fixed', text: 'In Progress' });
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
            color={user.current_role === AUDITOR ? 'secondary' : 'primary'}
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
