import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import CreateNewFolderOutlinedIcon from '@mui/icons-material/CreateNewFolderOutlined.js';
import { addTestsLabel } from '../../lib/helper.js';

const AttachFileModal = ({ isOpen, setIsOpen }) => {
  const [filename, setFilename] = useState('');
  const formData = new FormData();

  const handleDisagree = () => {
    setIsOpen(false);
  };

  const handleAgree = () => {
    setIsOpen(false);
  };

  const handleAttach = e => {
    const file = e.target.files[0];
    setFilename(file?.name);
    formData.append('file', file);
  };

  return (
    <Dialog open={isOpen} onClose={handleDisagree}>
      <DialogTitle>Attach file</DialogTitle>
      <DialogContent sx={{ display: 'flex' }}>
        <Box sx={inputWrapper}>{filename}</Box>
        <Button {...addTestsLabel('attach-file-button')}>
          <label htmlFor="file-upload">
            <CreateNewFolderOutlinedIcon fontSize="large" color="disabled" />
          </label>
        </Button>
        <input
          id="file-upload"
          style={{ display: 'none' }}
          onChange={handleAttach}
          type="file"
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleDisagree}
          variant="contained"
          color="primary"
          sx={buttonSx}
          {...addTestsLabel('resolve-disagree-button')}
        >
          Cancel
        </Button>
        <Button
          onClick={handleAgree}
          variant="contained"
          color="secondary"
          sx={buttonSx}
          {...addTestsLabel('resolve-agree-button')}
        >
          Send
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AttachFileModal;

const buttonSx = () => ({
  textTransform: 'unset',
  fontWeight: 600,
});

const inputWrapper = theme => ({
  border: '1.43062px solid #E5E5E5',
  width: '400px',
  padding: '15px',
  marginRight: '10px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  [theme.breakpoints.down('sm')]: {
    width: '250px',
    overflow: 'hidden',
    whiteSpace: 'noWrap',
  },
  [theme.breakpoints.down('xs')]: {
    width: '200px',
  },
});
