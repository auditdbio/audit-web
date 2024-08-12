import React from 'react';
import EditIcon from '@mui/icons-material/Edit.js';
import SaveIcon from '@mui/icons-material/Save.js';
import { Button } from '@mui/material';
import { useSelector } from 'react-redux';
import { CUSTOMER } from '../../redux/actions/types.js';

const EditButton = ({ editMode, handleClick }) => {
  const currentRole = useSelector(s => s.user.user.current_role);
  return (
    <Button
      sx={{ ml: '8px', minWidth: 'unset', maxWidth: 'unset' }}
      onClick={handleClick}
    >
      {!editMode ? (
        <EditIcon
          color={currentRole === CUSTOMER ? 'primary' : 'secondary'}
          fontSize={'small'}
        />
      ) : (
        <SaveIcon
          color={currentRole === CUSTOMER ? 'primary' : 'secondary'}
          fontSize={'small'}
        />
      )}
    </Button>
  );
};
//
export default EditButton;
