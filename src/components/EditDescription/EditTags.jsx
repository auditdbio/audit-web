import React, { useState } from 'react';
import {
  editAuditCustomer,
  editAuditRequestCustomer,
} from '../../redux/actions/auditAction.js';
import { Form, Formik } from 'formik';
import { Box, Button, Typography } from '@mui/material';
import EditButton from './EditButton.jsx';
import TagsField from '../forms/tags-field/tags-field.jsx';
import CloseIcon from '@mui/icons-material/Close.js';
import { useDispatch } from 'react-redux';

const EditTags = ({ audit, confirmed }) => {
  const [editTags, setEditTags] = useState(false);
  const dispatch = useDispatch();
  return (
    <Formik
      initialValues={{
        tags: audit?.tags,
        id: audit?.id,
      }}
      onSubmit={values => {
        if (!!confirmed) {
          dispatch(editAuditCustomer(values));
        } else {
          dispatch(editAuditRequestCustomer(values));
        }
        setEditTags(false);
      }}
    >
      {({ handleSubmit: submitTags, values, resetForm }) => {
        return (
          <Form>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '5px',
                  alignItems: 'center',
                  height: '32px',
                }}
              >
                <Typography sx={titleSx}>
                  {values?.tags?.map(el => el).join(', ') ?? ''}
                </Typography>
                {!editTags && (
                  <EditButton
                    handleClick={() => setEditTags(!editTags)}
                    editMode={editTags}
                  />
                )}
              </Box>
              {editTags && (
                <Box
                  sx={{
                    width: '325px',
                    mt: '7px',
                    display: 'flex',
                    gap: '7px',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    '& input': {
                      paddingX: '5.5px',
                      paddingLeft: '10px',
                    },
                  }}
                >
                  <TagsField size={'small'} name="tags" tags={audit?.tags} />
                  <Box
                    sx={{
                      display: 'flex',
                      '& button': { height: '40px' },
                    }}
                  >
                    <EditButton handleClick={submitTags} editMode={editTags} />
                    <Button
                      onClick={() => {
                        setEditTags(false);
                        resetForm();
                      }}
                    >
                      <CloseIcon fontSize={'small'} />
                    </Button>
                  </Box>
                </Box>
              )}
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
