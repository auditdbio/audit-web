import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useField } from 'formik';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Avatar, Box, Button, useMediaQuery } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit.js';
import ClearIcon from '@mui/icons-material/Clear';
import { AUDITOR } from '../../../redux/actions/types.js';
import theme from '../../../styles/themes.js';
import { ASSET_URL } from '../../../services/urls.js';
import CustomSnackbar from '../../custom/CustomSnackbar.jsx';
import { addTestsLabel } from '../../../lib/helper.js';
import { updateAuditor } from '../../../redux/actions/auditorAction.js';
import { updateCustomer } from '../../../redux/actions/customerAction.js';
import * as jdenticon from 'jdenticon';

const AvatarForm = ({ role, name, value, size }) => {
  const dispatch = useDispatch();
  const matchXxs = useMediaQuery(theme.breakpoints.down('xxs'));
  const { user } = useSelector(state => state.user);
  const [avatarField, , fieldHelper] = useField(name);
  const formData = new FormData();
  const [error, setError] = useState(null);
  const svgRef = useRef(null);
  const [pngUrl, setPngUrl] = useState('');
  const [deletedAvatar, setDeletedAvatar] = useState(false);

  const generateIcon = useCallback(() => {
    const value = avatarField.value.toString();

    if (value === '' || value.startsWith('data:image/png;base64')) {
      return false;
    }

    return true;
  }, [avatarField.value]);

  const sendAvatar = (withSave = false) => {
    axios
      .post(ASSET_URL, formData, {
        headers: { Authorization: 'Bearer ' + Cookies.get('token') },
      })
      .then(() => {
        const avatar = formData.get('path');
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
        formData.delete('path');
        formData.delete('original_name');
        formData.delete('private');
      });
  };

  useEffect(() => {
    if (!generateIcon() && !deletedAvatar) {
      if (svgRef.current) {
        jdenticon.update(svgRef.current);

        const svgString = new XMLSerializer().serializeToString(svgRef.current);
        const svgBlob = new Blob([svgString], {
          type: 'image/svg+xml;charset=utf-8',
        });
        const url = URL.createObjectURL(svgBlob);

        const image = new Image();
        image.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = size;
          canvas.height = size;
          const ctx = canvas.getContext('2d');

          ctx.drawImage(image, 0, 0, size, size);

          const pngDataUrl = canvas.toDataURL('image/png');
          setPngUrl(pngDataUrl);
          URL.revokeObjectURL(url);
        };
        image.src = url;
      }
    } else {
      setDeletedAvatar(false);
    }
  }, [value, size, generateIcon]);

  useEffect(() => {
    const saveImage = setTimeout(() => {
      if (pngUrl) {
        fetch(pngUrl)
          .then(res => res.blob())
          .then(pngBlob => {
            formData.append('file', pngBlob, 'avatar.png');
            formData.append(
              'path',
              user.id + user.current_role + pngUrl.slice(-9),
            );
            formData.append('original_name', 'avatar.png');
            formData.append('private', 'false');
            sendAvatar();
          })
          .catch(err => {
            console.error('Error converting PNG to Blob:', err);
            setError('Error uploading avatar image');
          });
      }
    }, 2000);

    return () => clearTimeout(saveImage);
  }, [pngUrl]);

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
      const avatarLink = user?.linked_accounts?.[0]?.avatar;
      const isThirdPartyImage = /^https?:\/\//i.test(avatarLink);

      if (isThirdPartyImage) {
        axios.get(avatarLink, { responseType: 'blob' }).then(({ data }) => {
          const filename =
            user.id +
            user.current_role +
            Date.now() +
            data.type.replace(/image\//, '.');
          formData.append('file', data);
          formData.append('path', filename);
          formData.append('original_name', filename);
          formData.append('private', 'false');
          sendAvatar(true);
        });
      }
    }
  }, [user]);

  const deletePhoto = () => {
    fieldHelper.setValue('');
    setDeletedAvatar(true);
  };

  return (
    <>
      <Avatar
        sx={avatarSx}
        src={avatarField.value && `${ASSET_URL}/${avatarField.value}`}
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
      {value && size && !generateIcon() && (
        <Box style={{ display: 'none' }}>
          <Box style={{ display: 'none' }}>
            {/* Скрытый элемент для рендеринга SVG */}
            <svg
              ref={svgRef}
              width={size}
              height={size}
              data-jdenticon-value={value}
            ></svg>
          </Box>
        </Box>
      )}
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
