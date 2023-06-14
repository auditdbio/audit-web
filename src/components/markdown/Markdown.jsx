import React from 'react';
import ReactMarkdownEditorLite from 'react-markdown-editor-lite';
import { Box } from '@mui/material';
import renderHTML from './renderHTML.jsx';
import 'katex/dist/katex.min.css';

const config = {
  view: {
    menu: false,
    md: false,
    html: true,
  },
};

const Markdown = ({ value }) => {
  return (
    <Box data-color-mode="light" sx={wrapper}>
      <ReactMarkdownEditorLite
        value={value}
        renderHTML={renderHTML}
        config={config}
      />
    </Box>
  );
};

export default Markdown;

const wrapper = {
  '& .rc-md-editor,.rc-md-editor .editor-container>.section': {
    backgroundColor: 'unset',
    border: 'unset',
  },
  '& > *': {
    wordWrap: 'break-word',
  },
  '& .mbin,.mrel': {
    margin: '0 3px',
  },
};
