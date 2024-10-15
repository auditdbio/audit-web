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
import {
  CHAT_ATTACHMENT_ENTITY,
  CHAT_PARENT_ENTITY,
} from '../../services/file_constants.js';

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
    formData.delete('private');
    formData.delete('full_access');
    formData.delete('file_entity');
    formData.delete('parent_entity_id');
    formData.delete('parent_entity_source');
    setFile(null);
  };

  const handleDisagree = () => {
    clearForm();
    setIsOpen(false);
    setError(() => null);
  };

  const handleAgree = () => {
    if (!file) return;

    const token = Cookies.get('token');
    formData.append('file', file);
    formData.append('private', 'true');
    formData.append('full_access', currentChat?.members.join(' '));
    formData.append('file_entity', CHAT_ATTACHMENT_ENTITY);
    formData.append('parent_entity_id', currentChat?.chatId);
    formData.append('parent_entity_source', CHAT_PARENT_ENTITY);

    axios
      .post(ASSET_URL, formData, {
        headers: { Authorization: 'Bearer ' + token },
      })
      .then(({ data }) => {
        const fileType = file.type.startsWith('image') ? 'Image' : 'File';

        dispatch(
          chatSendMessage(
            data.id,
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
              <CreateNewFolderOutlinedIcon
                fontSize="large"
                color="disabled"
                sx={{ cursor: 'pointer' }}
              />
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
            disabled={!file}
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
