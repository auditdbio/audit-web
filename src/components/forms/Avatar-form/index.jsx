import React, { useState } from 'react';
import { useField } from 'formik';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useSelector } from 'react-redux';
import { Avatar, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit.js';
import { AUDITOR } from '../../../redux/actions/types.js';
import theme from '../../../styles/themes.js';
import { ASSET_URL } from '../../../services/urls.js';
import CustomSnackbar from '../../custom/CustomSnackbar.jsx';

const AvatarForm = ({ role, name }) => {
  const user = useSelector(state => state.user.user);
  const [avatarField, , fieldHelper] = useField(name);
  const formData = new FormData();
  const [error, setError] = useState(null);

  const handleUpdateAvatar = e => {
    const file = e.target.files[0];
    const fileSize = file.size;
    if (fileSize > 10000000) {
      return setError('File size is too big');
    } else {
      formData.append('file', file);
      formData.append('path', user.id + user.current_role + file.name);
      formData.append('original_name', file.name);
      formData.append('private', 'false');
      axios
        .post(ASSET_URL, formData, {
          headers: { Authorization: 'Bearer ' + Cookies.get('token') },
        })
        .then(data => {
          fieldHelper.setValue(formData.get('path'));
          formData.delete('file');
          formData.delete('path');
          formData.delete('original_name');
          formData.delete('private');
        })
        .catch(err => {
          if (err?.code === 'ERR_NETWORK') {
            setError('File size is too big');
          } else {
            setError('Error while uploading file');
          }
          formData.delete('file');
          formData.delete('path');
          formData.delete('original_name');
          formData.delete('private');
        });
    }
  };

  return (
    <>
      <Avatar src={avatarField.value && `${ASSET_URL}/${avatarField.value}`} />

      <CustomSnackbar
        autoHideDuration={10000}
        open={!!error}
        onClose={() => setError(null)}
        severity="error"
        text={error}
      />

      <Button
        sx={role === AUDITOR ? { color: theme.palette.secondary.main } : {}}
      >
        <label
          htmlFor="file-upload"
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <EditIcon fontSize={'small'} />
          Edit photo
        </label>
      </Button>
      <input
        id={'file-upload'}
        style={{ display: 'none' }}
        accept={'.jpg,.png,.jpeg,.gif,.bmp,.tif,.tiff,.webp'}
        onChange={handleUpdateAvatar}
        type="file"
      />
    </>
  );
};

export default AvatarForm;
