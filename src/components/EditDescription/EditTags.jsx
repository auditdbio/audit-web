import React, { useState } from 'react';
import {
  editAuditCustomer,
  editAuditRequestCustomer,
} from '../../redux/actions/auditAction.js';
import { FastField, Form, Formik } from 'formik';
import { Box, Button, Modal, Typography } from '@mui/material';
import EditButton from './EditButton.jsx';
import TagsField from '../forms/tags-field/tags-field.jsx';
import CloseIcon from '@mui/icons-material/Close.js';
import { useDispatch } from 'react-redux';
import TagsArray from '../tagsArray/index.jsx';
import { TextField } from 'formik-mui';
import { addTestsLabel } from '../../lib/helper.js';
import { RESOLVED } from '../../redux/actions/types.js';

const EditTags = ({ audit, confirmed, hideChange }) => {
  const [editTags, setEditTags] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const dispatch = useDispatch();
  return (
    <Formik
      initialValues={{
        tags: audit?.tags,
        comment: '',
        id: audit?.id,
      }}
      onSubmit={values => {
        if (!!confirmed) {
          dispatch(editAuditCustomer(values));
        } else {
          dispatch(editAuditRequestCustomer(values));
        }
        setEditTags(false);
        setShowComment(false);
      }}
    >
      {({ handleSubmit: submitTags, values, resetForm, dirty }) => {
        return (
          <Form>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                // mt: '15px',
              }}
            >
              {editTags && (
                <Box sx={fieldWrapper} className={'tags-wrapper'}>
                  <TagsField size={'small'} name="tags" tags={audit?.tags} />
                  <Box
                    sx={{
                      display: 'flex',
                      '& button': { height: '40px' },
                    }}
                  >
                    <Button
                      onClick={() => {
                        if (dirty) {
                          setShowComment(true);
                        } else {
                          setEditTags(false);
                          resetForm();
                        }
                      }}
                      sx={{ minWidth: 'unset' }}
                    >
                      <CloseIcon fontSize={'small'} />
                    </Button>
                    <Modal
                      open={showComment}
                      onClose={() => setShowComment(false)}
                      aria-labelledby="modal-modal-title"
                      aria-describedby="modal-modal-description"
                    >
                      <Box
                        sx={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          width: '100%',
                          maxWidth: '650px',
                          bgcolor: 'background.paper',
                          boxShadow: 24,
                          borderRadius: '10px',
                          p: 2,
                        }}
                      >
                        <FastField
                          component={TextField}
                          name={'comment'}
                          // label={label}
                          placeholder={'Add your comment for tag updates'}
                          fullWidth={true}
                          disabled={false}
                          maxRows={4}
                          multiline={true}
                          rows={4}
                          inputProps={{ ...addTestsLabel(`comment-input`) }}
                        />
                        <Button
                          sx={{
                            mt: '15px',
                            marginLeft: 'auto',
                            marginRight: 0,
                            display: 'block',
                            textTransform: 'unset',
                          }}
                          variant={'contained'}
                          onClick={submitTags}
                        >
                          Save
                        </Button>
                      </Box>
                    </Modal>
                  </Box>
                </Box>
              )}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '5px',
                  alignItems: 'center',
                  // mt: '5px',
                  '& .tags-array-wrapper': {
                    gap: '5px',
                  },
                }}
              >
                {!editTags ? (
                  <Typography sx={titleSx}>
                    {values?.tags?.map(el => el).join(', ') ?? ''}
                  </Typography>
                ) : (
                  <Box sx={tagsWrapper}>
                    <TagsArray name="tags" />
                  </Box>
                )}
                {!hideChange &&
                  !editTags &&
                  audit?.status?.toLowerCase() !== RESOLVED.toLowerCase() && (
                    <EditButton
                      handleClick={() => setEditTags(!editTags)}
                      editMode={editTags}
                    />
                  )}
              </Box>
            </Box>
          </Form>
        );
      }}
    </Formik>
  );
};

export default EditTags;

const titleSx = theme => ({
  fontWeight: 500,
  fontSize: '16px !important',
  [theme.breakpoints.down('sm')]: {
    fontSize: '14px !important',
  },
});

const tagsWrapper = theme => ({
  width: '325px',
  [theme.breakpoints.down('xs')]: {
    width: '300px',
  },
});

const fieldWrapper = theme => ({
  maxWidth: '325px',
  width: '100%',
  mt: '7px',
  display: 'flex',
  gap: '7px',
  alignItems: 'flex-start',
  justifyContent: 'center',
  '& input': {
    paddingX: '5.5px',
    paddingLeft: '10px',
  },
  [theme.breakpoints.down('xs')]: {
    maxWidth: '300px',
  },
});
