import React, { useState } from 'react';
import { Field, useField } from 'formik';
import { TextField } from 'formik-mui';
import { Box, Button, IconButton, InputAdornment, Modal } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useSelector } from 'react-redux';
import { AUDITOR } from '../../../redux/actions/types.js';
import CustomSnackbar from '../../custom/CustomSnackbar.jsx';
import { addTestsLabel } from '../../../lib/helper.js';
import CloseIcon from '@mui/icons-material/Close';

const TagsField = ({
  name,
  label,
  placeholder,
  size = 'medium',
  sx = {},
  setFieldTouched,
  handleSubmit,
  onBlur,
}) => {
  const role = useSelector(s => s.user.user.current_role);
  const [field, meta, fieldHelper] = useField(name);
  const [state, setState] = useState('');
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const popularTags = ['solidity', 'zkp', 'rust', 'defi', 'web3'];

  const handleAddTag = () => {
    if (name !== 'scope' && name !== 'links') {
      if (state.length <= 30 && state) {
        if (field.value.length < 20) {
          fieldHelper.setValue([...field.value, state]);
          setState('');
        } else {
          setError('The maximum number of tags that can be added is 20');
        }
      } else {
        setError('Tag length is limited to 30 characters');
      }
    } else {
      if (field.value.length < 20) {
        const link = state.trim();
        if (/^.+\..+/.test(link)) {
          if (/^https?:\/\//.test(link)) {
            fieldHelper.setValue([...field.value, link]);
            setState('');
          } else {
            fieldHelper.setValue([...field.value, `https://${link}`]);
            setState('');
          }
          if (handleSubmit) handleSubmit();
        }
      } else {
        setError('The maximum number of links that can be added is 20');
      }
    }

    if (onBlur) {
      onBlur();
    }
  };

  const handleChange = e => {
    setState(e.target.value);
  };

  const handleBlur = () => {
    if (setFieldTouched && !meta.touched) {
      setFieldTouched(name);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box sx={wrapper} className={'field-wrapper'}>
      <CustomSnackbar
        autoHideDuration={5000}
        open={!!error}
        onClose={() => setError(null)}
        severity="error"
        text={error}
      />
      <Box>
        <Field
          component={TextField}
          placeholder={placeholder ? placeholder : ''}
          fullWidth={true}
          name={'tag-field'}
          disabled={false}
          label={label}
          size={size}
          value={state || ''}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddTag();
            }
          }}
          onChange={handleChange}
          onBlur={handleBlur}
          sx={[fieldSx, meta.error && meta.touched ? errorSx : {}, sx]}
          inputProps={{ ...addTestsLabel('tags-input') }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  edge="end"
                  color={role !== AUDITOR ? 'primary' : 'secondary'}
                  onClick={handleAddTag}
                  {...addTestsLabel('add-tag-button')}
                >
                  <AddIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        {name !== 'scope' && name !== 'links' && (
          <>
            <Button
              sx={{ marginTop: '12px' }}
              color={role !== AUDITOR ? 'primary' : 'secondary'}
              onClick={handleOpen}
            >
              Popular tags
            </Button>
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <Button
                  sx={{
                    position: 'absolute',
                    top: '5px',
                    right: '5px',
                    minWidth: 'unset',
                  }}
                  onClick={handleClose}
                >
                  <CloseIcon
                    color={role !== AUDITOR ? 'primary' : 'secondary'}
                  />
                </Button>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {popularTags.map((tag, index) => (
                    <Button
                      key={index}
                      sx={{ textTransform: 'none' }}
                      color={role !== AUDITOR ? 'primary' : 'secondary'}
                      disabled={field.value.includes(tag)}
                      onClick={() => {
                        if (field.value.length < 20) {
                          fieldHelper.setValue([...field.value, tag]);
                        } else {
                          setError(
                            'The maximum number of tags that can be added is 20',
                          );
                        }

                        if (onBlur) {
                          onBlur();
                        }

                        if (field.value.length === 19) {
                          handleClose();
                        }
                      }}
                    >
                      {tag}
                    </Button>
                  ))}
                </Box>
              </Box>
            </Modal>
          </>
        )}
      </Box>
    </Box>
  );
};

export default TagsField;

const style = theme => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: '10px',
  boxShadow: 24,
  p: 4,
  [theme.breakpoints.down('xs')]: {
    p: 2,
    width: 300,
  },
});

const errorSx = theme => ({
  '& fieldset': {
    borderColor: theme.palette.error.main,
  },
});

const wrapper = theme => ({
  display: 'flex',
  gap: '28px',
  flexDirection: 'column',
  '& button': {
    textTransform: 'unset',
  },
  '& p.Mui-error': {
    display: 'none',
  },
});

const formLabelSx = theme => ({
  fontWeight: 500,
  fontSize: '14px',
  lineHeight: '24px',
  color: '#434242',
  [theme.breakpoints.down('lg')]: {
    fontSize: '14px',
  },
});

const fieldSx = theme => ({
  '& input': {
    paddingLeft: '35px',
  },
  [theme.breakpoints.up('sm')]: {
    '& input': {
      fontSize: '18px',
    },
    '& .MuiFormLabel-root,.MuiInputLabel-root': {
      fontSize: '18px',
    },
  },
});
