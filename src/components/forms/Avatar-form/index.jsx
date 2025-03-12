import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useField } from 'formik';
import axios from 'axios';
import { Avatar, Button, useMediaQuery } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit.js';
import ClearIcon from '@mui/icons-material/Clear';
import { AUDITOR } from '../../../redux/actions/types.js';
import theme from '../../../styles/themes.js';
import { ASSET_URL } from '../../../services/urls.js';
import { addTestsLabel } from '../../../lib/helper.js';
import { AVATAR_ENTITY } from '../../../services/file_constants.js';

const AvatarForm = ({
  role,
  name,
  formData,
  setDeletedAvatar,
  setError,
  sendAvatar,
}) => {
  const matchXxs = useMediaQuery(theme.breakpoints.down('xxs'));
  const { user } = useSelector(state => state.user);
  const [avatarField, , fieldHelper] = useField(name);

  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);

  useEffect(() => {
    Array.from(formData.keys()).forEach(key => {
      formData.delete(key);
    });

    if (avatarFile) {
      formData.set('file', avatarFile);
      formData.set('private', 'false');
      formData.set('file_entity', AVATAR_ENTITY);
      formData.set('parent_entity_id', user.id);
      formData.set('parent_entity_source', user.current_role);
    }
  }, [avatarFile, formData, user.id, user.current_role]);

  const handleUpdateAvatar = e => {
    const file = e.target.files[0];
    if (file) {
      const fileSize = file.size;
      if (fileSize > 10_000_000) {
        return setError('File size is too big');
      } else {
        setAvatarFile(file);

        const reader = new FileReader();
        reader.onloadend = () => {
          setAvatarPreview(reader.result);
        };
        reader.readAsDataURL(file);

        setDeletedAvatar(null);
      }
    }
  };

  const deletePhoto = () => {
    if (avatarField?.value) {
      setDeletedAvatar(avatarField.value);
    }
    if (avatarPreview) {
      setAvatarFile(null);
      setAvatarPreview(null);
    }
    fieldHelper.setValue('');
  };

  useEffect(() => {
    if (user.is_new && !avatarField.value) {
      const avatarLink = user?.linked_accounts?.[0]?.avatar;
      const isThirdPartyImage = /^https?:\/\//i.test(avatarLink);

      if (isThirdPartyImage) {
        axios.get(avatarLink, { responseType: 'blob' }).then(({ data }) => {
          const filename = user.id + data.type.replace(/image\//, '.');
          setAvatarFile(data);
          formData.append('original_name', filename);
          sendAvatar(true);
        });
      }
    }
  }, [user]);

  return (
    <>
      {avatarPreview ? (
        <Avatar sx={avatarSx} src={avatarPreview} />
      ) : (
        <Avatar
          sx={avatarSx}
          src={avatarField.value && `${ASSET_URL}/id/${avatarField.value}`}
        />
      )}

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
      {(avatarField?.value || avatarPreview) && (
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
