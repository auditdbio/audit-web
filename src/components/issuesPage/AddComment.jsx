import React from 'react';
import { useDispatch } from 'react-redux';
import { Box, Button, Typography } from '@mui/material';
import { Form, Formik } from 'formik';
import MarkdownEditor from '../markdown/Markdown-editor.jsx';
import TitlePlugin from '../markdown/plugins/TitlePlugin.jsx';
import { addTestsLabel } from '../../lib/helper.js';
import { updateAuditIssue } from '../../redux/actions/issueAction.js';
import theme from '../../styles/themes.js';
import * as Yup from 'yup';

const AddComment = ({ auditId, issueId }) => {
  const dispatch = useDispatch();

  return (
    <Formik
      initialValues={{ message: '' }}
      validationSchema={validationSchema}
      validateOnBlur={false}
      validateOnChange={false}
      onSubmit={(values, { resetForm }) => {
        const comment = {
          events: [{ kind: 'Comment', message: values.message }],
        };
        dispatch(updateAuditIssue(auditId, issueId, comment));
        resetForm();
      }}
    >
      {({ handleSubmit, setFieldTouched, touched, errors }) => {
        return (
          <Form
            onSubmit={handleSubmit}
            style={{ width: '100%', paddingTop: '30px' }}
          >
            <Box sx={{ width: '100%' }}>
              <MarkdownEditor
                name="message"
                setFieldTouched={setFieldTouched}
                plugins={[TitlePlugin]}
                mdProps={{
                  placeholder: 'Leave a comment',
                  view: { menu: true, md: true, html: false },
                }}
              />
            </Box>
            <Box sx={buttonBlock}>
              {touched.message && errors.message && (
                <Typography
                  sx={{
                    color: `${theme.palette.error.main}!important`,
                    fontSize: '14px',
                    mr: '15px',
                  }}
                >
                  {errors.message}
                </Typography>
              )}
              <Button
                variant="contained"
                type="submit"
                color="secondary"
                sx={{ fontWeight: 600, textTransform: 'unset' }}
                {...addTestsLabel('add-comment-button')}
              >
                Submit
              </Button>
            </Box>
          </Form>
        );
      }}
    </Formik>
  );
};

export default AddComment;

const validationSchema = Yup.object().shape({
  message: Yup.string().required('Comment cannot be empty'),
});

const buttonBlock = {
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  width: '100%',
  padding: '16px 30px',
  backgroundColor: '#F5F5F5',
  border: '2px solid #E5E5E5',
};
