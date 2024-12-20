import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Collapse,
  IconButton,
  Tooltip,
  Typography,
  useMediaQuery,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit.js';
import AddLinkIcon from '@mui/icons-material/AddLink.js';
import MarkdownEditor from '../../markdown/Markdown-editor.jsx';
import { AUDITOR, CUSTOMER, RESOLVED } from '../../../redux/actions/types.js';
import { addTestsLabel } from '../../../lib/helper.js';
import { ProjectLinksList } from '../../custom/ProjectLinksList.jsx';
import CustomLink from '../../custom/CustomLink.jsx';
import theme from '../../../styles/themes.js';
import TagsField from '../../forms/tags-field/tags-field.jsx';
import { useFormik, useFormikContext } from 'formik';
import { AUDIT_PARENT_ENTITY } from '../../../services/file_constants.js';
import ExpandLessOutlinedIcon from '@mui/icons-material/ExpandLessOutlined.js';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const DescriptionBlock = ({
  editMode,
  errors,
  touched,
  setFieldTouched,
  handleSubmit,
  values,
  user,
  audit,
  issue = null,
  isEditFeedback,
  setIsEditFeedback,
  isPublic,
  hideControl,
}) => {
  const matchXs = useMediaQuery(theme.breakpoints.down('xs'));
  const { isValid } = useFormikContext();
  const [addLinkField, setAddLinkField] = useState(false);
  const [mdRef, setMdRef] = useState(null);
  const [feedbackRef, setFeedbackRef] = useState(null);
  const [isEditDescription, setIsEditDescription] = useState(!editMode);
  const [showFull, setShowFull] = useState(false);

  useEffect(() => {
    setTimeout(() => feedbackRef?.current?.nodeMdText?.current?.focus(), 100);
  }, [feedbackRef]);

  const handleDescriptionEdit = (handleSubmit, values) => {
    if (!values.description?.trim()) return;

    if (isEditDescription) {
      mdRef?.current?.setView({ menu: false, md: false, html: true });
      handleSubmit();
    } else {
      mdRef.current?.setView({ menu: true, md: true, html: !matchXs });
      setTimeout(() => mdRef?.current?.nodeMdText?.current?.focus(), 100);
    }
    setIsEditDescription(!isEditDescription);
  };

  const getMarkdownInitialView = () => {
    if (editMode) {
      return { menu: false, md: false, html: true };
    } else {
      if (matchXs) {
        return { menu: true, md: true, html: false };
      }
      return { menu: true, md: true, html: true };
    }
  };

  const handleFeedbackEdit = handleSubmit => {
    if (isEditFeedback) {
      feedbackRef?.current?.setView({ menu: false, md: false, html: true });
      handleSubmit();
    } else {
      feedbackRef.current?.setView({ menu: true, md: true, html: false });
      setTimeout(() => feedbackRef?.current?.nodeMdText?.current?.focus(), 100);
    }
    setIsEditFeedback(!isEditFeedback);
  };

  const getFeedbackView = () => {
    if (
      (user.current_role.toLowerCase() === CUSTOMER.toLowerCase() ||
        user.current_role.toLowerCase() === AUDITOR.toLowerCase() ||
        isPublic) &&
      isEditFeedback
    ) {
      return { menu: true, md: true, html: false };
    }
    return { menu: false, md: false, html: true };
  };

  return (
    <Box>
      <Collapse
        in={true}
        collapsedSize={editMode ? (showFull ? undefined : 140) : '100%'}
      >
        <Box sx={descriptionWrapper(theme, editMode ? showFull : true)}>
          <Box sx={markdownWrapper}>
            <MarkdownEditor
              name="description"
              setMdRef={setMdRef}
              setFieldTouched={setFieldTouched}
              isPublic={isPublic}
              mdProps={{
                view: getMarkdownInitialView(),
                placeholder:
                  touched.description &&
                  (errors.description || !values.description)
                    ? 'Description is required'
                    : 'Issue description',
                style: markdownSx(matchXs),
              }}
              parentEntity={
                audit?.id
                  ? {
                      id: audit.id,
                      source: AUDIT_PARENT_ENTITY,
                    }
                  : null
              }
            />
          </Box>

          {(user.current_role !== CUSTOMER || isPublic) &&
            !hideControl &&
            audit?.status?.toLowerCase() !== RESOLVED.toLowerCase() && (
              <Box
                sx={[
                  descriptionButtonsSx,
                  addLinkField && { justifyContent: 'flex-end' },
                ]}
              >
                {!addLinkField && (
                  <IconButton
                    type="button"
                    aria-label="add link"
                    onClick={() => setAddLinkField(true)}
                    sx={[addLinkButton]}
                    {...addTestsLabel('add-link-button')}
                  >
                    <AddLinkIcon color="secondary" />
                    <Box component="span" sx={editButtonText}>
                      Add link
                    </Box>
                  </IconButton>
                )}
                {editMode && (
                  <IconButton
                    type="button"
                    aria-label="Edit description"
                    onClick={() => handleDescriptionEdit(handleSubmit, values)}
                    sx={editButton}
                    {...addTestsLabel('edit-description-button')}
                  >
                    <EditIcon color="secondary" fontSize="small" />
                    <Box component="span" sx={editButtonText}>
                      {isEditDescription ? 'Save' : 'Edit'}
                    </Box>
                  </IconButton>
                )}
              </Box>
            )}

          <Box sx={linksList}>
            {user.current_role !== CUSTOMER &&
            !hideControl &&
            audit?.status?.toLowerCase() !== RESOLVED.toLowerCase() ? (
              <ProjectLinksList
                hideControl={hideControl}
                name="links"
                handleSubmit={handleSubmit}
              />
            ) : (
              <Box sx={customerLinksList}>
                {values.links?.map((link, idx) => (
                  <CustomLink link={link} key={idx} sx={linkSx} />
                ))}
              </Box>
            )}
          </Box>

          {touched.description && errors.description && (
            <Typography
              sx={{
                color: `${theme.palette.error.main}!important`,
                fontSize: '14px',
              }}
            >
              {errors.description}
            </Typography>
          )}

          {addLinkField && (
            <Box sx={{ mt: '10px' }}>
              {user.current_role !== CUSTOMER && (
                <TagsField
                  size="small"
                  name="links"
                  label="Links"
                  handleSubmit={editMode ? handleSubmit : null}
                  sx={linkFieldSx}
                />
              )}
            </Box>
          )}
        </Box>
      </Collapse>
      {editMode && (
        <Box
          sx={[
            {
              display: 'flex',
              justifyContent: 'center',
              position: 'relative',
              paddingTop: '5px',
              marginX: '1px',
              ...(issue?.events?.length
                ? {
                    '&::before': eventLine(
                      values.feedback || isEditFeedback || editMode || showFull
                        ? 37
                        : 19,
                      1,
                      35,
                    ),
                  }
                : {}),
            },
            !showFull
              ? {
                  borderTop: '1px solid #e0e0e0',
                }
              : {},
          ]}
        >
          <Button
            onClick={() => setShowFull(!showFull)}
            color={'secondary'}
            sx={[
              readAllButton,
              {
                // position: 'relative',
                top: !showFull ? '-22px' : 0,
                backgroundColor: '#fcfaf6',
                zIndex: '1',
                // marginBottom: showFull ? '20px' : 0,
                '&:hover': {
                  backgroundColor: '#fcfaf6',
                },
              },
            ]}
            variant={'outlined'}
          >
            <span>{showFull ? 'Hide' : `Show`}</span>
            <EditIcon sx={{ width: '20px' }} />
            <ExpandLessOutlinedIcon
              sx={[
                showFull ? {} : { transform: 'rotate(180deg)' },
                {
                  transition: '0.2s',
                  // marginRight: '0',
                  // marginLeft: 'auto',
                  width: '20px',
                  height: '20px',
                },
              ]}
            />
          </Button>
        </Box>
      )}
      {(values.feedback || isEditFeedback || (isPublic && editMode)) && (
        <Box sx={[feedbackWrapper, editMode && !showFull ? { mt: 0 } : {}]}>
          {!isEditFeedback && (
            <Box sx={feedbackHeader}>
              {isPublic ? 'Customer feedback' : 'Feedback'}
            </Box>
          )}
          <MarkdownEditor
            name="feedback"
            setMdRef={setFeedbackRef}
            mdProps={{
              view: getFeedbackView(),
              placeholder: isPublic ? 'Customer feedback' : 'Feedback',
              style: isEditFeedback
                ? { ...feedbackMarkdownSx, height: '238px' }
                : feedbackMarkdownSx,
            }}
            parentEntity={{
              id: audit?.id,
              source: AUDIT_PARENT_ENTITY,
            }}
          />
          {(user.current_role.toLowerCase() === CUSTOMER.toLowerCase() ||
            user.current_role.toLowerCase() === AUDITOR.toLowerCase() ||
            isPublic) && (
            <Box sx={editFeedbackButtonWrapper}>
              <IconButton
                type="button"
                aria-label="Edit feedback"
                onClick={() => handleFeedbackEdit(handleSubmit)}
                sx={editButton}
                disabled={!isValid}
                {...addTestsLabel('edit-feedback-button')}
              >
                <EditIcon color="secondary" fontSize="small" />
                <Box component="span" sx={editButtonText}>
                  {isEditFeedback ? 'Save' : 'Edit'}
                </Box>
              </IconButton>
              {user.current_role.toLowerCase() === AUDITOR.toLowerCase() && (
                <Tooltip
                  title={
                    'Customer feedback will be included in the report. Do not edit this field without a reasonable cause.'
                  }
                  placement="top"
                  arrow={true}
                  enterTouchDelay={0}
                  leaveTouchDelay={4000}
                >
                  <Button
                    color="secondary"
                    sx={{
                      minWidth: '20px',
                      textTransform: 'none',
                      padding: '2px',
                      [theme.breakpoints.down(600)]: {
                        padding: 0,
                      },
                    }}
                  >
                    <HelpOutlineIcon
                      sx={{ fontSize: '18px' }}
                      cursor="pointer"
                    />
                  </Button>
                </Tooltip>
              )}
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default DescriptionBlock;

const eventLine = (height, top, left) => ({
  content: '""',
  display: 'block',
  position: 'absolute',
  top: `-${top || height}px`,
  left: `${left || 36}px`,
  width: '1px',
  height: `${height + 1}px`,
  backgroundColor: '#b9b9b9',
  [theme.breakpoints.down('xs')]: {
    left: '16px',
  },
});

const descriptionWrapper = (theme, showFull) => ({
  maxHeight: showFull ? 'none' : 140,
  '& .rc-md-editor': {
    height: '100%!important',
    minHeight: '300px',
  },
  overflow: 'hidden',
  transition: 'max-height 0.3s ease',
  '& .rc-md-editor .editor-container>.section': {
    borderRight: 'unset',
  },
});

const readAllButton = theme => ({
  p: '3px',
  paddingX: '8px',
  minWidth: 'unset',
  textTransform: 'unset',
  boxShadow: 'unset',
  fontWeight: 600,
  borderRadius: '8px',
  width: '280px',
  display: 'flex',
  alignItems: 'center',
  gap: '7px',
  // maxWidth: '300px',
  [theme.breakpoints.down('xs')]: {
    fontSize: '16px',
  },
});

const editButtonText = theme => ({
  ml: '6px',
  color: theme.palette.secondary.main,
  fontWeight: 500,
  fontSize: '14px',
  lineHeight: '17px',
});

const descriptionButtonsSx = {
  height: '40px',
  padding: '0 10px',
  display: 'flex',
  justifyContent: 'space-between',
  borderLeft: '1px solid #e0e0e0',
  borderRight: '1px solid #e0e0e0',
  marginX: '1px',
};

const editButton = {
  display: 'flex',
  alignItems: 'flex-end',
};

const addLinkButton = {
  display: 'flex',
  alignItems: 'center',
};

const linksList = {
  border: '1px solid #e0e0e0',
  borderTop: 'none',
  padding: '0 15px 15px',
  marginX: '1px',
};

const linkFieldSx = {
  position: 'relative',
  '& > div': { borderRadius: 0 },
  '& fieldset': { borderColor: '#b9b9b9' },
  '&::before': eventLine(10),
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

const linkSx = theme => ({
  fontSize: '18px',
  [theme.breakpoints.down('sm')]: {
    fontSize: '15px',
  },
});

const markdownWrapper = {
  position: 'relative',
  '& .rc-md-editor': {
    // borderBottom: 'none',
    borderRight: '1px solid #e0e0e0!important',
  },
  '& .sec-html': {
    borderRight: 'unset!important',
  },
  '& .sec-md': {
    borderRight: '1px solid #e0e0e0!important',
    // borderRight: '1px solid #b9b9b9',
    // borderBottom: '1px solid #b9b9b9',
  },
  // '& .section': {
  //   borderRightColor: '#b9b9b9 !important',
  // },
  // '& .sec-md.visible': {
  //   borderBottom: '1px solid #b9b9b9',
  // },
};

const markdownSx = matchXs => ({
  height: '550px',
  backgroundColor: '#fcfaf6',
  fontWeight: 500,
  fontSize: '20px !important',
  lineHeight: '24px',
  // borderLeft: '1px solid #b9b9b9',
  // borderTop: matchXs ? '1px solid #b9b9b9' : 'none',
  borderRight: 'none',
});

const feedbackWrapper = {
  position: 'relative',
  mt: '20px',
  '& .rc-md-navigation.visible': {
    borderRight: '1px solid #e0e0e0',
    // borderBottom: '1px solid #b9b9b9',
  },
  '& .rc-md-editor': {
    height: '100%!important',
  },
  '& .sec-html': {
    borderRight: '1px solid #e0e0e0!important',
  },
  '& .section': {
    borderColor: '#e0e0e0 !important',
  },
  '&::before': eventLine(20),
};

const feedbackHeader = {
  border: '1px solid #e0e0e0',
  borderBottom: 'none',
  background: '#F5F5F5',
  padding: '9px 15px',
  fontWeight: 500,
  marginX: '1px',
};

const feedbackMarkdownSx = {
  height: '200px',
  border: '1px solid #e0e0e0',
  borderRight: 'none',
  backgroundColor: '#fcfaf6',
  '& .rc-md-editor': {
    borderRight: '1px solid #e0e0e0',
  },
};

const editFeedbackButtonWrapper = {
  position: 'absolute',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  right: '12px',
  bottom: '5px',
};
