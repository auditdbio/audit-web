import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useField } from 'formik';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Avatar, Button, useMediaQuery } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit.js';
import ClearIcon from '@mui/icons-material/Clear';
import { AUDITOR } from '../../../redux/actions/types.js';
import theme from '../../../styles/themes.js';
import { ASSET_URL } from '../../../services/urls.js';
import CustomSnackbar from '../../custom/CustomSnackbar.jsx';
import { addTestsLabel } from '../../../lib/helper.js';
import { updateAuditor } from '../../../redux/actions/auditorAction.js';
import { updateCustomer } from '../../../redux/actions/customerAction.js';
import { AVATAR_ENTITY } from '../../../services/file_constants.js';

const AvatarForm = ({ role, name }) => {
  const dispatch = useDispatch();
  const matchXxs = useMediaQuery(theme.breakpoints.down('xxs'));
  const { user } = useSelector(state => state.user);
  const [avatarField, , fieldHelper] = useField(name);
  const formData = new FormData();
  const [error, setError] = useState(null);

  const sendAvatar = (withSave = false) => {
    axios
      .post(ASSET_URL, formData, {
        headers: { Authorization: 'Bearer ' + Cookies.get('token') },
      })
      .then(({ data }) => {
        const avatar = data.id;
        fieldHelper.setValue(avatar);
        if (withSave) {
          if (role === AUDITOR) {
            dispatch(updateAuditor({ avatar }, false));
          } else {
            dispatch(updateCustomer({ avatar }, false));
          }
        }
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
        formData.delete('private');
        formData.delete('original_name');
        formData.delete('file_entity');
        formData.delete('parent_entity_id');
        formData.delete('parent_entity_source');
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
        formData.append('private', 'false');
        formData.append('file_entity', AVATAR_ENTITY);
        formData.append('parent_entity_id', user.id);
        formData.append('parent_entity_source', user.current_role);

        sendAvatar();
      }
    }
  };

  useEffect(() => {
    if (user.is_new && !avatarField.value) {
      const avatarLink = user?.linked_accounts?.[0]?.avatar;
      const isThirdPartyImage = /^https?:\/\//i.test(avatarLink);

      if (isThirdPartyImage) {
        axios.get(avatarLink, { responseType: 'blob' }).then(({ data }) => {
          const filename = user.id + data.type.replace(/image\//, '.');
          formData.append('file', data);
          formData.append('private', 'false');
          formData.append('original_name', filename);
          formData.append('file_entity', AVATAR_ENTITY);
          formData.append('parent_entity_id', user.id);
          formData.append('parent_entity_source', user.current_role);
          sendAvatar(true);
        });
      }
    }
  }, [user]);

  const deletePhoto = () => {
    fieldHelper.setValue('');
    // TODO: add delete file request
  };

  return (
    <>
      <Avatar
        sx={avatarSx}
        src={avatarField.value && `${ASSET_URL}/id/${avatarField.value}`}
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
          {!matchXxs && <EditIcon fontSize="small" />}
          Edit photo
        </label>
      </Button>
      {avatarField.value && (
        <Button
          sx={deletePhotoSx(role)}
          onClick={deletePhoto}
          {...addTestsLabel('delete-photo-button')}
        >
          {!matchXxs && <ClearIcon fontSize="small" />}
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

const avatarSx = theme => ({
  mb: '20px',
  [theme.breakpoints.down('sm')]: {
    mb: '10px',
  },
  [theme.breakpoints.down('xs')]: {
    mb: '5px',
  },
});

const deletePhotoSx = role => ({
  display: 'flex',
  alignItems: 'center',
  color:
    role === AUDITOR
      ? theme.palette.secondary.main
      : theme.palette.primary.main,
});
