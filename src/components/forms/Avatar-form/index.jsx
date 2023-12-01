import React, { useState, useEffect } from 'react';
import { useField } from 'formik';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useSelector } from 'react-redux';
import { Avatar, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit.js';
import ClearIcon from '@mui/icons-material/Clear';
import { AUDITOR } from '../../../redux/actions/types.js';
import theme from '../../../styles/themes.js';
import { ASSET_URL } from '../../../services/urls.js';
import CustomSnackbar from '../../custom/CustomSnackbar.jsx';
import { addTestsLabel } from '../../../lib/helper.js';

const AvatarForm = ({ role, name }) => {
  const { user } = useSelector(state => state.user);
  const [avatarField, , fieldHelper] = useField(name);
  const formData = new FormData();
  const [error, setError] = useState(null);

  const sendAvatar = () => {
    axios
      .post(ASSET_URL, formData, {
        headers: { Authorization: 'Bearer ' + Cookies.get('token') },
      })
      .then(() => {
        fieldHelper.setValue(formData.get('path'));
      })
      .catch(err => {
        if (err?.code === 'ERR_NETWORK') {
          setError('File size is too big');
        } else {
          setError('Error while uploading file');
        }
      })
      .finally(() => {
        formData.delete('file');
        formData.delete('path');
        formData.delete('original_name');
        formData.delete('private');
      });
  };

  const handleUpdateAvatar = e => {
    const file = e.target.files[0];
    if (file) {
      const fileSize = file.size;
      if (fileSize > 10000000) {
        return setError('File size is too big');
      } else {
        formData.append('file', file);
        formData.append('path', user.id + user.current_role + file.name);
        formData.append('original_name', file.name);
        formData.append('private', 'false');
        sendAvatar();
      }
    }
  };

  useEffect(() => {
    if (user.is_new && !avatarField.value) {
      const avatar = user?.linked_accounts?.[0]?.avatar;
      const isThirdPartyImage = /^https?:\/\//i.test(avatar);

      if (isThirdPartyImage) {
        axios
          .get(avatarField.value, { responseType: 'blob' })
          .then(({ data }) => {
            const filename =
              user.id +
              user.current_role +
              Date.now() +
              data.type.replace(/image\//, '.');
            formData.append('file', data);
            formData.append('path', filename);
            formData.append('original_name', filename);
            formData.append('private', 'false');
            sendAvatar();
          });
      }
    }
  }, [user]);

  const deletePhoto = () => {
    fieldHelper.setValue('');
  };

  return (
    <>
      <Avatar
        sx={{ mb: '35px' }}
        src={
          avatarField.value &&
          !/^https?:\/\//i.test(avatarField.value) &&
          `${ASSET_URL}/${avatarField.value}`
        }
      />

      <CustomSnackbar
        autoHideDuration={10000}
        open={!!error}
        onClose={() => setError(null)}
        severity="error"
        text={error}
      />

      <Button
        sx={role === AUDITOR ? { color: theme.palette.secondary.main } : {}}
        {...addTestsLabel('edit-photo-button')}
      >
        <label
          htmlFor="file-upload"
          style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
        >
          <EditIcon fontSize="small" />
          Edit photo
        </label>
      </Button>
      {avatarField.value && (
        <Button
          sx={deletePhotoSx(role)}
          onClick={deletePhoto}
          {...addTestsLabel('delete-photo-button')}
        >
          <ClearIcon fontSize="small" />
          Delete photo
        </Button>
      )}

      <input
        id="file-upload"
        style={{ display: 'none' }}
        accept=".jpg,.png,.jpeg,.gif,.bmp,.tif,.tiff,.webp"
        onChange={handleUpdateAvatar}
        type="file"
      />
    </>
  );
};

export default AvatarForm;

const deletePhotoSx = role => ({
  display: 'flex',
  alignItems: 'center',
  color:
    role === AUDITOR
      ? theme.palette.secondary.main
      : theme.palette.primary.main,
});
