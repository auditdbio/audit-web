import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import Cookies from 'js-cookie';
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
import { ASSET_URL } from '../../services/urls.js';
import CustomSnackbar from '../custom/CustomSnackbar.jsx';
import { chatSendMessage } from '../../redux/actions/chatActions.js';

const AttachFileModal = ({ isOpen, setIsOpen, currentChat, user }) => {
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const inputRef = useRef();
  const formData = new FormData();

  useEffect(() => {
    setTimeout(() => {
      if (inputRef?.current && isOpen) {
        inputRef.current.click();
      }
    }, 200);
  }, [isOpen]);

  const clearForm = () => {
    formData.delete('file');
    formData.delete('path');
    formData.delete('original_name');
    formData.delete('private');
    setFile(null);
  };

  const handleDisagree = () => {
    clearForm();
    setIsOpen(false);
    setError(() => null);
  };

  const handleAgree = () => {
    const token = Cookies.get('token');
    const path = +new Date() + file.name;

    if (file) {
      formData.append('file', file);
      formData.append('path', path);
      formData.append('original_name', file.name);
      formData.append('private', 'true');
      formData.append('full_access', currentChat?.members.join(' '));
    }

    axios
      .post(ASSET_URL, formData, {
        headers: { Authorization: 'Bearer ' + token },
      })
      .then(() => {
        const fileUrl = path.replace(/ /g, '%20');
        const fileType = file?.type.startsWith('image') ? 'Image' : 'File';

        dispatch(
          chatSendMessage(
            fileUrl,
            { id: currentChat?.chatId, role: currentChat?.role },
            user.current_role,
            currentChat?.isNew,
            fileType,
          ),
        );
      })
      .catch(() => {
        setError('Error while uploading file');
      })
      .finally(() => {
        clearForm();
        setIsOpen(false);
      });
  };

  const handleAttach = e => {
    const currentFile = e.target.files[0];
    const fileSize = currentFile.size;
    if (fileSize > 10_485_760) {
      return setError('Max size 10MB');
    }
    setFile(currentFile);
    formData.append('file', currentFile);
  };

  return (
    <>
      <CustomSnackbar
        autoHideDuration={5000}
        open={!!error}
        onClose={() => setError(null)}
        severity="error"
        text={error}
      />

      <Dialog open={isOpen} onClose={handleDisagree}>
        <DialogTitle>Attach file</DialogTitle>
        <DialogContent sx={{ display: 'flex' }}>
          <Box sx={inputWrapper}>{file?.name}</Box>
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
            ref={inputRef}
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
    </>
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
