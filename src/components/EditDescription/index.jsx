import React, { useEffect, useRef, useState } from 'react';
import Markdown from '../markdown/Markdown.jsx';
import { Form, Formik } from 'formik';
import {
  editAuditCustomer,
  editAuditRequestCustomer,
} from '../../redux/actions/auditAction.js';
import { Box, Button, useMediaQuery } from '@mui/material';
import MarkdownEditor from '../markdown/Markdown-editor.jsx';
import CloseIcon from '@mui/icons-material/Close.js';
import SaveIcon from '@mui/icons-material/Save.js';
import { useDispatch } from 'react-redux';
import { RESOLVED } from '../../redux/actions/types.js';
import EditIcon from '@mui/icons-material/Edit.js';
import theme from '../../styles/themes.js';

const EditDescription = ({ audit, auditRequest }) => {
  const [editMode, setEditMode] = useState(false);
  const [showFull, setShowFull] = useState(false);
  const descriptionRef = useRef();
  const dispatch = useDispatch();
  const [showReadMoreButton, setShowReadMoreButton] = useState(false);
  const matchXs = useMediaQuery(theme.breakpoints.down('xs'));

  useEffect(() => {
    setTimeout(() => {
      if (descriptionRef?.current?.offsetHeight > 400) {
        setShowReadMoreButton(true);
      }
    }, 500);
  }, [descriptionRef.current]);

  const handleEdit = () => {
    setEditMode(true);
  };

  return (
    <>
      <Box sx={descriptionSx(showFull || editMode)}>
        <Box ref={descriptionRef}>
          {!editMode ? (
            <Markdown value={audit?.description} />
          ) : (
            <Formik
              initialValues={{
                description: audit?.description,
                ...audit,
              }}
              onSubmit={values => {
                if (auditRequest) {
                  dispatch(editAuditRequestCustomer(values));
                } else {
                  dispatch(editAuditCustomer(values));
                }
                setEditMode(false);
              }}
            >
              {({ handleSubmit, setFieldTouched, dirty }) => {
                return (
                  <Form onSubmit={handleSubmit}>
                    <Box sx={{ position: 'relative' }}>
                      <MarkdownEditor
                        name="description"
                        setFieldTouched={setFieldTouched}
                        fastSave={true}
                        mdProps={{
                          view: { menu: true, md: true, html: !matchXs },
                        }}
                      />
                      <Box sx={editBtnSx}>
                        <Button
                          variant={'text'}
                          type={'button'}
                          disabled={!dirty}
                          onClick={handleSubmit}
                        >
                          <SaveIcon />
                        </Button>
                        <Button>
                          <CloseIcon
                            color={'secondary'}
                            onClick={() => setEditMode(false)}
                          />
                        </Button>
                      </Box>
                    </Box>
                  </Form>
                );
              }}
            </Formik>
          )}
        </Box>
      </Box>
      <Box
        sx={[
          {
            display: 'flex',
            background: '#E5E5E5',
            borderRadius: 0,
            boxShadow: '0px -24px 14px -8px rgba(252, 250, 246, 1)',
            ':hover': { background: '#D5D5D5' },
            padding: '8px',
            position: 'relative',
          },
        ]}
      >
        {showReadMoreButton && !editMode && (
          <Button onClick={() => setShowFull(!showFull)} sx={readAllButton}>
            {showFull ? 'Hide ▲' : `Read all ▼`}
          </Button>
        )}
        {!editMode &&
          audit?.status?.toLowerCase() !== RESOLVED.toLowerCase() && (
            <Box
              sx={{
                position: 'absolute',
                bottom: showReadMoreButton ? '70px' : '20px',
                right: '10px',
              }}
            >
              <Button variant={'text'} onClick={handleEdit}>
                <EditIcon fontSize={'large'} />
              </Button>
            </Box>
          )}
      </Box>
    </>
  );
};

export default EditDescription;

const editBtnSx = theme => ({
  position: 'absolute',
  bottom: '15px',
  display: 'flex',
  gap: '7px',
  flexDirection: 'column',
  right: '10px',
});
const descriptionSx = full => ({
  maxHeight: full ? 'unset' : '400px',
  overflow: 'hidden',
  border: '2px solid #E5E5E5',
});

const readAllButton = theme => ({
  width: '100%',
  padding: '8px',
  fontWeight: 600,
  fontSize: '16px',
  color: 'black',
  textTransform: 'none',
  lineHeight: '25px',
  [theme.breakpoints.down('xs')]: {
    fontSize: '16px',
    border: 'none',
  },
});
