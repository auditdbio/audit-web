import React, { useEffect, useRef, useState } from 'react';
import Markdown from '../markdown/Markdown.jsx';
import { FastField, Form, Formik } from 'formik';
import {
  editAuditCustomer,
  editAuditRequestCustomer,
} from '../../redux/actions/auditAction.js';
import {
  Box,
  Button,
  IconButton,
  Modal,
  useMediaQuery,
  Collapse,
} from '@mui/material';
import MarkdownEditor from '../markdown/Markdown-editor.jsx';
import CloseIcon from '@mui/icons-material/Close.js';
import SaveIcon from '@mui/icons-material/Save.js';
import { useDispatch, useSelector } from 'react-redux';
import { CUSTOMER, RESOLVED } from '../../redux/actions/types.js';
import EditIcon from '@mui/icons-material/Edit.js';
import theme from '../../styles/themes.js';
import { ProjectLinksList } from '../custom/ProjectLinksList.jsx';
import CustomLink from '../custom/CustomLink.jsx';
import TagsField from '../forms/tags-field/tags-field.jsx';
import { addTestsLabel } from '../../lib/helper.js';
import AddLinkIcon from '@mui/icons-material/AddLink.js';
import { TextField } from 'formik-mui';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

const EditDescription = ({ audit, auditRequest, hideChange, isModal }) => {
  const [editMode, setEditMode] = useState(false);
  const [showFull, setShowFull] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const descriptionRef = useRef();
  const dispatch = useDispatch();
  const [editorRef, setEditorRef] = useState(null);
  const [showReadMoreButton, setShowReadMoreButton] = useState(false);
  const matchXs = useMediaQuery(theme.breakpoints.down('xs'));
  const [addLinkField, setAddLinkField] = useState(false);
  const user = useSelector(s => s.user.user);

  useEffect(() => {
    setTimeout(() => {
      if (isModal) {
        if (descriptionRef?.current.clientHeight > 150) {
          setShowReadMoreButton(true);
        }
      } else {
        if (descriptionRef?.current.clientHeight > 450) {
          setShowReadMoreButton(true);
        }
      }
    }, 500);
  }, []);

  const handleEdit = () => {
    setEditMode(true);
  };

  const toggleExpand = () => {
    setShowFull(prev => !prev);
  };

  return (
    <>
      <Box sx={descriptionSx}>
        <Box>
          <Formik
            initialValues={{
              description: audit?.description,
              id: audit?.id,
              scope: audit?.scope,
              comment: '',
            }}
            onSubmit={values => {
              if (auditRequest) {
                dispatch(editAuditRequestCustomer(values));
              } else {
                dispatch(editAuditCustomer(values));
              }
              setShowComment(false);
              setEditMode(false);
            }}
          >
            {({ handleSubmit, setFieldTouched, dirty, values }) => {
              return (
                <Form onSubmit={handleSubmit}>
                  <Collapse in={showFull} collapsedSize={200}>
                    {editMode ? (
                      <Box>
                        <MarkdownEditor
                          name="description"
                          setFieldTouched={setFieldTouched}
                          fastSave={true}
                          mdProps={{
                            view: { menu: true, md: true, html: !matchXs },
                            style: editMarkdownSx(),
                          }}
                          sx={{
                            border: 'unset',
                          }}
                        />
                      </Box>
                    ) : (
                      <>
                        <Box ref={descriptionRef}>
                          <MarkdownEditor
                            name="description"
                            setFieldTouched={setFieldTouched}
                            mdProps={{
                              view: { menu: false, md: false, html: true },
                              style: markdownSx(matchXs, values.description),
                            }}
                            hideMenu={true}
                            setMdRef={setEditorRef}
                            sx={{
                              border: 'unset',
                            }}
                          />
                        </Box>
                      </>
                    )}
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        borderLeft: '1px solid #dfe0df',
                        borderRight: '1px solid #dfe0df',
                        alignItems: 'center',
                      }}
                    >
                      {!hideChange && (
                        <Box>
                          <IconButton
                            type="button"
                            aria-label="add link"
                            onClick={() => {
                              setAddLinkField(!addLinkField);
                            }}
                            sx={[addLinkButton]}
                            {...addTestsLabel('add-link-button')}
                          >
                            <AddLinkIcon
                              color={
                                user.current_role === CUSTOMER
                                  ? 'primary'
                                  : 'secondary'
                              }
                            />
                            <Box
                              component="span"
                              sx={editButtonText(theme, user)}
                            >
                              {addLinkField ? 'Close' : 'Add Link'}
                            </Box>
                          </IconButton>
                        </Box>
                      )}
                      {!hideChange &&
                        (!editMode ? (
                          audit?.status?.toLowerCase() !==
                            RESOLVED.toLowerCase() && (
                            <Button
                              variant="text"
                              sx={{
                                textTransform: 'unset',
                              }}
                              color={
                                user.current_role === CUSTOMER
                                  ? 'primary'
                                  : 'secondary'
                              }
                              onClick={handleEdit}
                            >
                              <EditIcon fontSize="small" sx={{ mr: '5px' }} />{' '}
                              Edit
                            </Button>
                          )
                        ) : (
                          <Box sx={editBtnSx}>
                            <Button
                              variant="text"
                              type="button"
                              disabled={!dirty}
                              onClick={() => setShowComment(true)}
                            >
                              <SaveIcon fontSize="small" />
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
                                  name="comment"
                                  placeholder="Add a comment"
                                  fullWidth={true}
                                  disabled={false}
                                  maxRows={4}
                                  multiline={true}
                                  rows={4}
                                  inputProps={{
                                    ...addTestsLabel('comment-input'),
                                  }}
                                />
                                <Button
                                  sx={{
                                    mt: '15px',
                                    marginLeft: 'auto',
                                    marginRight: 0,
                                    display: 'block',
                                    textTransform: 'unset',
                                  }}
                                  variant="contained"
                                  onClick={handleSubmit}
                                >
                                  Save
                                </Button>
                              </Box>
                            </Modal>
                            <Button>
                              <CloseIcon
                                fontSize="small"
                                color="secondary"
                                onClick={() => setEditMode(false)}
                              />
                            </Button>
                          </Box>
                        ))}
                    </Box>
                    <Box sx={hideChange ? linksList : {}}>
                      {!hideChange &&
                        (audit?.status?.toLowerCase() !==
                        RESOLVED.toLowerCase() ? (
                          <Box sx={linksList}>
                            <ProjectLinksList
                              name="scope"
                              handleSubmit={handleSubmit}
                            />
                          </Box>
                        ) : (
                          <Box sx={customerLinksList}>
                            {values.scope?.map((link, idx) => (
                              <CustomLink link={link} key={idx} />
                            ))}
                          </Box>
                        ))}
                    </Box>
                    {addLinkField && (
                      <Box sx={{ mt: '10px' }}>
                        <TagsField
                          size="small"
                          name="scope"
                          label="Links"
                          handleSubmit={handleSubmit}
                          sx={linkFieldSx}
                        />
                      </Box>
                    )}
                  </Collapse>
                  {showReadMoreButton && !editMode && (
                    <Button
                      variant="contained"
                      sx={showMoreSx}
                      onClick={toggleExpand}
                    >
                      {showFull ? 'Reduce' : 'Expand'}{' '}
                      {!showFull ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />}
                    </Button>
                  )}
                </Form>
              );
            }}
          </Formik>
        </Box>
      </Box>
    </>
  );
};

export default EditDescription;

const editButtonText = (theme, user) => ({
  ml: '6px',
  color:
    user.current_role === CUSTOMER
      ? theme.palette.primary.main
      : theme.palette.secondary.main,
  fontWeight: 500,
  fontSize: '14px',
  lineHeight: '17px',
});

const addLinkButton = {
  display: 'flex',
  alignItems: 'center',
};

const markdownSx = (matchXs, description) => ({
  minHeight: '250px',
  paddingBottom: '20px',
  backgroundColor: '#fcfaf6',
  fontWeight: 500,
  fontSize: '20px !important',
  lineHeight: '24px',
});

const editMarkdownSx = () => ({
  minHeight: '350px',
  backgroundColor: '#fcfaf6',
  fontWeight: 500,
  fontSize: '20px !important',
  lineHeight: '24px',
});

const linksList = {
  border: '1px solid #dfe0df',
  borderTop: 'none',
  padding: '0 15px 15px',
};

const showMoreSx = theme => ({
  width: '100%',
  mb: '20px',
  textTransform: 'unset',
  backgroundColor: '#d7d7d7',
  color: '#000',
  '&:hover': {
    backgroundColor: '#adacac',
  },
});

const customerLinksList = {
  display: 'flex',
  flexWrap: 'wrap',
};

const editBtnSx = {
  display: 'flex',
  gap: '8px',
  alignItems: 'center',
};

const linkFieldSx = {
  '& .MuiFormLabel-root': {
    fontWeight: 600,
  },
};

const descriptionSx = {
  '& .rc-md-editor': {
    borderBottom: 'none',
  },
};
