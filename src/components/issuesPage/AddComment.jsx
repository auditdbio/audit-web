import React from 'react';
import { Box, Button } from '@mui/material';
import { Form, Formik } from 'formik';
import Markdown from '../custom/Markdown-editor.jsx';
import MarkdownTitlePlugin from './MarkdownTitlePlugin.jsx';
import { addTestsLabel } from '../../lib/helper.js';

const AddComment = () => {
  return (
    <Formik
      initialValues={{ comment: '' }}
      onSubmit={values => {
        console.log(values);
        console.log('comment added. API');
      }}
    >
      {({ handleSubmit, values, resetForm }) => {
        return (
          <Form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <Box sx={{ width: '100%' }}>
              <Markdown
                name="comment"
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
                disabled={!values.comment}
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
