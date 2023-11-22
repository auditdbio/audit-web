import React, { useEffect, useState } from 'react';
import { Box, IconButton, Typography, useMediaQuery } from '@mui/material';
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

const DescriptionBlock = ({
  editMode,
  errors,
  touched,
  setFieldTouched,
  handleSubmit,
  values,
  user,
  audit,
  isEditFeedback,
  setIsEditFeedback,
}) => {
  const matchXs = useMediaQuery(theme.breakpoints.down('xs'));
  const { isValid } = useFormikContext();
  const [addLinkField, setAddLinkField] = useState(false);
  const [mdRef, setMdRef] = useState(null);
  const [feedbackRef, setFeedbackRef] = useState(null);
  const [isEditDescription, setIsEditDescription] = useState(!editMode);

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
    if (user.current_role === CUSTOMER && isEditFeedback) {
      return { menu: true, md: true, html: false };
    }
    return { menu: false, md: false, html: true };
  };

  return (
    <Box sx={descriptionBlock}>
      <Box sx={markdownWrapper}>
        <MarkdownEditor
          name="description"
          setMdRef={setMdRef}
          setFieldTouched={setFieldTouched}
          mdProps={{
            view: getMarkdownInitialView(),
            placeholder:
              touched.description && errors.description
                ? 'Description is required'
                : 'Description',
            style: markdownSx(matchXs),
          }}
        />
      </Box>

      {user.current_role !== CUSTOMER &&
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
        audit?.status?.toLowerCase() !== RESOLVED.toLowerCase() ? (
          <ProjectLinksList name="links" handleSubmit={handleSubmit} />
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

      {(values.feedback || isEditFeedback) && (
        <Box sx={feedbackWrapper}>
          {!isEditFeedback && <Box sx={feedbackHeader}>Feedback</Box>}
          <MarkdownEditor
            name="feedback"
            setMdRef={setFeedbackRef}
            mdProps={{
              view: getFeedbackView(),
              placeholder: 'Feedback',
              style: isEditFeedback
                ? { ...feedbackMarkdownSx, height: '238px' }
                : feedbackMarkdownSx,
            }}
          />

          {user.current_role === CUSTOMER && (
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
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default DescriptionBlock;

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

const descriptionBlock = theme => ({
  width: '80%',
  [theme.breakpoints.down('sm')]: {
    width: '70%',
  },
  [theme.breakpoints.down('xs')]: {
    width: '100%',
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
  borderLeft: '1px solid #b9b9b9',
  borderRight: '1px solid #b9b9b9',
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
  border: '1px solid #b9b9b9',
  borderTop: 'none',
  padding: '0 15px 15px',
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
    borderBottom: 'none',
  },
  '& .rc-md-navigation.visible': {
    borderRight: '1px solid #b9b9b9',
    borderBottom: '1px solid #b9b9b9',
  },
  '& .section': {
    borderRightColor: '#b9b9b9 !important',
  },
  '& .sec-md.visible': {
    borderBottom: '1px solid #b9b9b9',
  },
};

const markdownSx = matchXs => ({
  height: '550px',
  backgroundColor: '#fcfaf6',
  fontWeight: 500,
  fontSize: '20px !important',
  lineHeight: '24px',
  borderLeft: '1px solid #b9b9b9',
  borderTop: matchXs ? '1px solid #b9b9b9' : 'none',
  borderRight: 'none',
});

const feedbackWrapper = {
  position: 'relative',
  mt: '20px',
  '& .rc-md-navigation.visible': {
    borderRight: '1px solid #b9b9b9',
    borderBottom: '1px solid #b9b9b9',
  },
  '& .section': {
    borderRightColor: '#b9b9b9 !important',
  },
  '&::before': eventLine(20),
};

const feedbackHeader = {
  border: '1px solid #b9b9b9',
  borderBottom: 'none',
  background: '#F5F5F5',
  padding: '9px 15px',
  fontWeight: 500,
};

const feedbackMarkdownSx = {
  height: '200px',
  border: '1px solid #b9b9b9',
  borderRight: 'none',
  backgroundColor: '#fcfaf6',
};

const editFeedbackButtonWrapper = {
  position: 'absolute',
  right: '12px',
  bottom: '5px',
};
