import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar, Box, Tooltip } from '@mui/material';
import { ASSET_URL } from '../../services/urls.js';
import { CUSTOMER } from '../../redux/actions/types.js';
import theme from '../../styles/themes.js';
import { useSelector } from 'react-redux';

const OrganizationList = ({ organizations }) => {
  const user = useSelector(s => s.user.user);
  return (
    <Box sx={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
      {organizations?.map(org => {
        if (org.avatar) {
          return (
            <Link to={`/o/${org.link_id}`} key={org.id}>
              <Tooltip title={org.name} placement="top" arrow>
                <Avatar
                  src={org.avatar ? `${ASSET_URL}/${org.avatar}` : ''}
                  sx={{
                    border: `1px solid ${
                      user.current_role === CUSTOMER
                        ? theme.palette.primary.main
                        : theme.palette.secondary.main
                    }`,
                    padding: '4px',
                  }}
                />
              </Tooltip>
            </Link>
          );
        } else {
          return (
            <Link to={`/o/${org.link_id}`} key={org.id}>
              <Tooltip title={org.name} placement="top" arrow>
                <Avatar
                  src={org.avatar ? `${ASSET_URL}/${org.avatar}` : ''}
                  sx={{
                    padding: '4px',
                    border: `1px solid ${
                      user.current_role === CUSTOMER
                        ? theme.palette.primary.main
                        : theme.palette.secondary.main
                    }`,
                  }}
                >
                  {org.name}
                </Avatar>
              </Tooltip>
            </Link>
          );
        }
      })}
    </Box>
  );
};

export default OrganizationList;
