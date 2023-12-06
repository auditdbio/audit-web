import React from 'react';
import { Box, Button, Checkbox } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import GitHubIcon from '@mui/icons-material/GitHub';

const IdentitySetting = () => {
  return (
    <Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <Box sx={{ display: 'flex' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
            <GitHubIcon />
            <RouterLink
              href={'https://github.com/auditdbio/audit-web/tree/prod'}
            >
              https://github.com/auditdbio/audit-web/tree/prod
            </RouterLink>
          </Box>
          <Checkbox defaultChecked />
        </Box>
        <Box sx={{ display: 'flex' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
            <GitHubIcon />
            <RouterLink
              href={'https://github.com/auditdbio/audit-web/tree/prod'}
            >
              https://github.com/auditdbio/audit-web/tree/prod
            </RouterLink>
          </Box>
          <Checkbox defaultChecked />
        </Box>
        <Box sx={{ display: 'flex' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
            <GitHubIcon />
            <RouterLink
              href={'https://github.com/auditdbio/audit-web/tree/prod'}
            >
              https://github.com/auditdbio/audit-web/tree/prod
            </RouterLink>
          </Box>
          <Checkbox defaultChecked />
        </Box>
      </Box>
      <Button>Add account</Button>
    </Box>
  );
};

export default IdentitySetting;
