import React, { useEffect, useRef, useState } from 'react';
import Markdown from '../markdown/Markdown.jsx';
import { Form, Formik } from 'formik';
import {
  editAuditCustomer,
  editAuditRequestCustomer,
} from '../../redux/actions/auditAction.js';
import { Box, Button, IconButton, useMediaQuery } from '@mui/material';
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

const EditDescription = ({ audit, auditRequest }) => {
  const [editMode, setEditMode] = useState(false);
  const [showFull, setShowFull] = useState(false);
  const descriptionRef = useRef();
  const dispatch = useDispatch();
  const [showReadMoreButton, setShowReadMoreButton] = useState(false);
  const matchXs = useMediaQuery(theme.breakpoints.down('xs'));
  const [addLinkField, setAddLinkField] = useState(false);
  const user = useSelector(s => s.user.user);

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
  //
  return (
    <>
      <Box sx={descriptionSx}>
        <Box ref={descriptionRef}>
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
            {({ handleSubmit, setFieldTouched, dirty, values }) => {
              return (
                <Form onSubmit={handleSubmit}>
                  {editMode ? (
                    <Box>
                      <MarkdownEditor
                        name="description"
                        setFieldTouched={setFieldTouched}
                        fastSave={true}
                        mdProps={{
                          view: { menu: true, md: true, html: !matchXs },
                          style: markdownSx(matchXs),
                        }}
                        sx={{
                          border: 'unset',
                        }}
                      />
                    </Box>
                  ) : (
                    <MarkdownEditor
                      name="description"
                      setFieldTouched={setFieldTouched}
                      mdProps={{
                        view: { menu: false, md: false, html: true },
                        style: markdownSx(matchXs),
                      }}
                      sx={{
                        border: 'unset',
                      }}
                    />
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
                        <Box component="span" sx={editButtonText(theme, user)}>
                          {addLinkField ? 'Close' : 'Add Link'}
                        </Box>
                      </IconButton>
                    </Box>
                    {!editMode ? (
                      audit?.status?.toLowerCase() !==
                        RESOLVED.toLowerCase() && (
                        <Button
                          variant={'text'}
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
                          <EditIcon fontSize={'small'} sx={{ mr: '5px' }} />{' '}
                          Edit
                        </Button>
                      )
                    ) : (
                      <Box sx={editBtnSx}>
                        <Button
                          variant={'text'}
                          type={'button'}
                          disabled={!dirty}
                          onClick={handleSubmit}
                        >
                          <SaveIcon fontSize={'small'} />
                        </Button>
                        <Button>
                          <CloseIcon
                            fontSize={'small'}
                            color={'secondary'}
                            onClick={() => setEditMode(false)}
                          />
                        </Button>
                      </Box>
                    )}
                  </Box>
                  <Box>
                    {/*{user.current_role !== CUSTOMER &&*/}
                    {audit?.status?.toLowerCase() !== RESOLVED.toLowerCase() ? (
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
                    )}
                  </Box>
                  {addLinkField && (
                    <Box sx={{ mt: '10px' }}>
                      {/*{user.current_role !== CUSTOMER && (*/}
                      <TagsField
                        size="small"
                        name="scope"
                        label="Links"
                        handleSubmit={handleSubmit}
                        sx={linkFieldSx}
                      />
                      {/*)}*/}
                    </Box>
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

const eventLine = height => ({
  content: '""',
  display: 'block',
  position: 'absolute',
  top: `-${height}px`,
  left: '36px',
  width: '1px',
  height: `${height + 1}px`,
  backgroundColor: '#b9b9b9',
  [theme.breakpoints.down('xs')]: {
    left: '16px',
  },
});

const linkFieldSx = {
  position: 'relative',
  '& > div': { borderRadius: 0 },
  '& fieldset': { borderColor: '#b9b9b9' },
  '&::before': eventLine(10),
};

const markdownSx = matchXs => ({
  height: '550px',
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

const customerLinksList = {
  display: 'flex',
  flexDirection: 'column',
  '& p': {
    display: 'flex',
    alignItems: 'center',
    fontSize: '18px',
  },
};
const editBtnSx = theme => ({
  display: 'flex',
  gap: '10px',
  paddingRight: '20px',
  '& button': {
    minWidth: 'unset',
  },
});
const descriptionSx = full => ({
  '& .rc-md-editor': {
    borderBottom: 'none',
  },
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
