import React from 'react';
import { Alert, AlertTitle, Button, Snackbar, Stack } from '@mui/material';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import TaskAltIcon from '@mui/icons-material/TaskAlt';

const CustomSnackbar = ({
  text,
  open,
  onClose,
  autoHideDuration,
  severity,
  action,
}) => {
  return (
    <Snackbar
      autoHideDuration={autoHideDuration || 5000}
      open={open}
      anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
      onClose={onClose}
    >
      <Stack
        sx={{ width: '100%', flexDirection: 'column', gap: 2 }}
        spacing={2}
      >
        <Alert
          severity={severity || 'info'}
          iconMapping={{
            error: <ErrorOutlineOutlinedIcon fontSize="inherit" sx={icon} />,
            info: <InfoOutlinedIcon fontSize="inherit" sx={icon} />,
            warning: <WarningAmberOutlinedIcon fontSize="inherit" sx={icon} />,
            success: <TaskAltIcon fontSize="inherit" sx={icon} />,
          }}
        >
          <AlertTitle sx={{ mb: 0 }}>
            {text}{' '}
            {action && (
              <Button
                color={'secondary'}
                variant={'contained'}
                onClick={action}
                sx={{ textTransform: 'unset', ml: '5px' }}
              >
                Reload
              </Button>
            )}
          </AlertTitle>
        </Alert>
      </Stack>
    </Snackbar>
  );
};

export default CustomSnackbar;

const icon = () => ({
  alignSelf: 'center',
});
