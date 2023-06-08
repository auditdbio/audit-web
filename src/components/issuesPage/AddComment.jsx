import React from 'react';
import { useDispatch } from 'react-redux';
import { Box, Button } from '@mui/material';
import { Form, Formik } from 'formik';
import Markdown from '../custom/Markdown-editor.jsx';
import MarkdownTitlePlugin from './MarkdownTitlePlugin.jsx';
import { addTestsLabel } from '../../lib/helper.js';
import { updateAuditIssue } from '../../redux/actions/issueAction.js';

const AddComment = ({ auditId, issueId }) => {
  const dispatch = useDispatch();

  return (
    <Formik
      initialValues={{ message: '' }}
      onSubmit={(values, { resetForm }) => {
        const comment = {
          events: [{ kind: 'Comment', message: values.message }],
        };
        dispatch(updateAuditIssue(auditId, issueId, comment));
        resetForm();
      }}
    >
      {({ handleSubmit, values }) => {
        return (
          <Form
            onSubmit={handleSubmit}
            style={{ width: '100%', paddingTop: '30px' }}
          >
            <Box sx={{ width: '100%' }}>
              <Markdown
                name="message"
                plugins={[MarkdownTitlePlugin]}
                mdProps={{
                  placeholder: 'Leave a comment',
                  view: { menu: true, md: true, html: false },
                }}
              />
            </Box>
            <Box sx={buttonBlock}>
              <Button
                variant="contained"
                type="submit"
                color="secondary"
                disabled={!values.message}
                {...addTestsLabel('add-comment-button')}
              >
                Add comment
              </Button>
            </Box>
          </Form>
        );
      }}
    </Formik>
  );
};

export default AddComment;

const buttonBlock = {
  display: 'flex',
  justifyContent: 'flex-end',
  width: '100%',
  padding: '16px 30px',
  backgroundColor: '#F5F5F5',
  border: '2px solid #E5E5E5',
};
