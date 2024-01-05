import React from 'react';
import { Box, Button, Tab, Tabs, Typography } from '@mui/material';
import { addTestsLabel } from '../../lib/helper.js';
import { radiusOfComponents } from '../../styles/themes.js';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

const RoleModal = ({ onClose, isAuditor, setIsAuditor, onClick }) => {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: '0',
        right: '0',
        left: '0',
        bottom: '0',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: '22',
      }}
    >
      <Box sx={innerModal}>
        <Button
          sx={{
            position: 'absolute',
            minWidth: 'unset',
            top: '0',
            left: '0',
            width: '36px',
          }}
          onClick={onClose}
        >
          <CloseRoundedIcon />
        </Button>
        <Typography variant={'h4'} sx={titleSx}>
          Select your role
        </Typography>
        <Tabs
          value={isAuditor}
          onChange={(e, newValue) => {
            setIsAuditor(newValue);
          }}
          name="role"
          sx={[tabsSx, { marginTop: '0!important' }]}
          indicatorColor="none"
        >
          <Tab
            value="auditor"
            sx={[
              isAuditor === 'auditor'
                ? auditorTabSx
                : { backgroundColor: '#D9D9D9' },
              tabSx,
            ]}
            label="Auditor"
            {...addTestsLabel('auditor-button')}
          />
          <Tab
            value="customer"
            sx={[
              isAuditor === 'customer'
                ? customerTabSx
                : { backgroundColor: '#D9D9D9' },
              tabSx,
            ]}
            label="Customer"
            {...addTestsLabel('customer-button')}
          />
        </Tabs>
        <Button sx={submitButton} variant={'contained'} onClick={onClick}>
          Confirm
        </Button>
      </Box>
    </Box>
  );
};

export default RoleModal;

const submitButton = theme => ({
  padding: '11px 0',
  color: '#FCFAF6',
  fontWeight: 600,
  borderRadius: radiusOfComponents,
  maxWidth: '262px',
  fontSize: '16px',
  paddingY: '11px',
  width: '100%',
  textTransform: 'unset',
  [theme.breakpoints.down('sm')]: {
    width: '225px',
    padding: '8px 0',
    fontSize: '14px',
  },
});

const innerModal = theme => ({
  width: '550px',
  height: '300px',
  backgroundColor: '#FCFAF6',
  padding: '20px',
  borderRadius: '10px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '35px',
  position: 'relative',
  [theme.breakpoints.down('sm')]: {
    width: '300px',
    height: '250px',
  },
});

const titleSx = them => ({
  fontSize: '32px',
  fontWeight: 600,
  [them.breakpoints.down('sm')]: {
    fontSize: '24px',
  },
});

const tabsSx = theme => ({
  marginBottom: 0,
  width: '420px',
  marginTop: '-50px',
  [theme.breakpoints.down('md')]: {
    width: '320px',
    marginTop: '-20px',
  },
  [theme.breakpoints.down('sm')]: {
    width: '250px',
    marginTop: '-10px',
  },
});

const tabSx = theme => ({
  width: '50%',
  color: '#222222',
  fontSize: '16px',
  textTransform: 'capitalize',
  [theme.breakpoints.down('md')]: {
    minHeight: '41px',
    height: '41px',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '14px',
  },
});

const auditorTabSx = theme => ({
  backgroundColor: theme.palette.secondary.main,
  color: '#FCFAF6!important',
});

const customerTabSx = theme => ({
  color: '#FCFAF6!important',
  backgroundColor: theme.palette.primary.main,
});
